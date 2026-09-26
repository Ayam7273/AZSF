import nodemailer from "nodemailer";
import formidable from "formidable";
import fs from "fs";
import { verifyRecaptcha } from "../lib/verifyRecaptcha.js";
import { contentFields, detectSpam, escapeHtml, fieldValue } from "../lib/spamCheck.js";

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