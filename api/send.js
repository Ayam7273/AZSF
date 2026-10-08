import nodemailer from "nodemailer";
import formidable from "formidable";
import fs from "fs";
import { verifyRecaptcha } from "../lib/verifyRecaptcha.js";
import { contentFields, detectSpam, escapeHtml, fieldValue } from "../lib/spamCheck.js";
import { isWithinServiceArea } from "../lib/geoCheck.js";
import { Redis } from "@upstash/redis";
import { buildIcsContent, findSlot, formatSlotLabel, reserveSlot } from "../lib/booking.js";

const redis = Redis.fromEnv();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  const form = formidable({
    multiples: false,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {

    if (err) {
      return res.status(500).json({
        message: "Form parsing error",
      });
    }

    try {

      // SPAM FILTER — pretend success so bots don't learn what tripped them
      const spamReason = detectSpam(fields);

      if (spamReason) {
        console.warn("APPLICATION SPAM BLOCKED:", spamReason);
        return res.writeHead(302, { Location: "/thanks.html" }).end();
      }

      // VERIFY RECAPTCHA
      const isHuman = await verifyRecaptcha(fields["g-recaptcha-response"]);

      if (!isHuman) {
        return res.status(400).json({ message: "reCAPTCHA verification failed. Please try again." });
      }

      // VERIFY SERVICE AREA
      const geoLat = parseFloat(fieldValue(fields, "geo_lat"));
      const geoLng = parseFloat(fieldValue(fields, "geo_lng"));

      if (!isWithinServiceArea(geoLat, geoLng)) {
        return res.writeHead(302, { Location: "/out-of-area.html" }).end();
      }

      // VERIFY & RESERVE APPOINTMENT SLOT
      const slotId = fieldValue(fields, "appointment_slot");
      const chosenSlot = slotId ? findSlot(slotId) : null;

      if (!chosenSlot) {
        return res.writeHead(302, { Location: "/slot-unavailable.html" }).end();
      }

      const applicantName = `${fieldValue(fields, "Firstname")} ${fieldValue(fields, "Lastname")}`.trim();
      const applicantEmail = fieldValue(fields, "Email");

      const reserved = await reserveSlot(redis, chosenSlot, {
        name: applicantName,
        email: applicantEmail,
        phone: fieldValue(fields, "Telephone"),
        bookedAt: new Date().toISOString(),
      });

      if (!reserved) {
        return res.writeHead(302, { Location: "/slot-unavailable.html" }).end();
      }

      // SMTP TRANSPORT
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
  },
});

      // FILE ATTACHMENT
      let attachments = [];

      if (files.Attachment) {

        const file = Array.isArray(files.Attachment)
          ? files.Attachment[0]
          : files.Attachment;

        attachments.push({
          filename: file.originalFilename,
          content: fs.createReadStream(file.filepath),
        });
      }

      // BUILD EMAIL HTML
      const html = `
        <h2>New Zakat Application</h2>

        <table border="1" cellpadding="10" cellspacing="0">
          <tr>
            <td><strong>Appointment</strong></td>
            <td>${escapeHtml(formatSlotLabel(chosenSlot))}</td>
          </tr>
          ${contentFields(fields)
            .map(
              ([key]) =>
                `<tr>
                  <td><strong>${escapeHtml(key)}</strong></td>
                  <td>${escapeHtml(fieldValue(fields, key))}</td>
                </tr>`
            )
            .join("")}
        </table>
      `;

      // SEND EMAIL
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: "alihsanzakatsadaqat@gmail.com",
        replyTo: fieldValue(fields, "Email") || process.env.SMTP_USER,
        subject: "New Zakat Application",
        html,
        attachments,
      });

      // SEND APPLICANT CONFIRMATION (best-effort — the application is already sent)
      if (applicantEmail) {
        try {
          const ics = buildIcsContent(chosenSlot, {
            summary: "Zakat Application Appointment – Al-Ihsan Zakat and Sadaqat Foundation",
            description: "Your appointment to discuss your Zakat application with Al-Ihsan Zakat and Sadaqat Foundation.",
            uid: `${chosenSlot.id}@al-ihsanzakat.com`,
          });

          await transporter.sendMail({
            from: `"Al-Ihsan Zakat and Sadaqat Foundation" <${process.env.SMTP_USER}>`,
            to: applicantEmail,
            subject: "Your Zakat Application Appointment",
            html: `
              <p>Assalamu alaikum${applicantName ? " " + escapeHtml(applicantName) : ""},</p>
              <p>Thank you for applying. Your appointment is confirmed for:</p>
              <p><strong>${escapeHtml(formatSlotLabel(chosenSlot))}</strong></p>
              <p>Location: Camberwell Islamic Centre, 188 Camberwell Road, London SE5 0ED</p>
            `,
            icalEvent: {
              filename: "appointment.ics",
              method: "PUBLISH",
              content: ics,
            },
          });
        } catch (confirmError) {
          console.error("APPOINTMENT CONFIRMATION EMAIL ERROR:", confirmError);
        }
      }

    return res.writeHead(302, {
  Location: "/thanks.html",
}).end();

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        error: error.message,
        fullError: error,
      });
    }
  });
}