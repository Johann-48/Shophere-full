const nodemailer = require("nodemailer");

const smtpGmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function verifyEmailTransport() {
  try {
    await smtpGmailTransporter.verify();
    console.info("SMTP Gmail pronto para enviar e-mails");
  } catch (error) {
    console.error("Falha ao verificar SMTP Gmail:", error.message);
  }
}

async function sendPasswordResetEmailSMTP(to, resetUrl) {
  const minutes = Number(process.env.RESET_TOKEN_EXP_MINUTES || 15);
  const from = process.env.MAIL_FROM || process.env.GMAIL_USER;

  const subject = "Redefinição de senha";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.5; color:#111827">
      <h2 style="margin:0 0 12px">Redefinição de senha</h2>
      <p>Recebemos uma solicitação para redefinir a sua senha.</p>
      <p>Clique no botão abaixo (ou copie o link) para criar uma nova senha. O link expira em ${minutes} minutos.</p>
      <p>
        <a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">
          Redefinir senha
        </a>
      </p>
      <p style="word-break:break-all"><strong>Link:</strong> <a href="${resetUrl}">${resetUrl}</a></p>
      <p>Se você não solicitou isto, ignore este e-mail.</p>
    </div>
  `;

  const text = `Redefinição de senha\nUse o link abaixo (expira em ${minutes} minutos):\n${resetUrl}\nSe você não solicitou isto, ignore este e-mail.`;

  await smtpGmailTransporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
}

module.exports = {
  smtpGmailTransporter,
  verifyEmailTransport,
  sendPasswordResetEmailSMTP,
};
