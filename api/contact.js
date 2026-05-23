import nodemailer from "nodemailer";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields) => {
    if (err) {
      console.error("Form error:", err);
      return res.status(500).json({ message: "Form parsing error" });
    }

    try {
      // SMTP TRANSPORT
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      // VERIFY SMTP
      await transporter.verify();

      // EMAIL HTML
      const html = `
        <h2>New Contact Form Message</h2>

        <table border="1" cellpadding="10" cellspacing="0">
          <tr><td><strong>First Name</strong></td><td>${fields.Firstname || ""}</td></tr>
          <tr><td><strong>Last Name</strong></td><td>${fields.Lastname || ""}</td></tr>
          <tr><td><strong>Email</strong></td><td>${fields.Email || ""}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${fields.Phone || ""}</td></tr>
          <tr><td><strong>Message</strong></td><td>${fields.Message || ""}</td></tr>
        </table>
      `;

      // SEND EMAIL
      const info = await transporter.sendMail({
        from: `"AZSF Contact Form" <${process.env.SMTP_USER}>`,
        to: "applications@al-ihsanzakat.com",
        replyTo: fields.Email || process.env.SMTP_USER,
        subject: "New Contact Form Message",
        html,
      });

      console.log("CONTACT EMAIL SENT:", info.messageId);

      // REDIRECT AFTER SUCCESS
      return res.writeHead(302, {
        Location: "/thanks.html",
      }).end();

    } catch (error) {
      console.error("CONTACT EMAIL ERROR:", error);

      return res.status(500).json({
        error: error.message,
      });
    }
  });
}