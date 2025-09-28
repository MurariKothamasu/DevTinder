const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = ({
  toAddress,
  fromAddress,
  subject,
  htmlBody,
  textBody,
}) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: ["support@codeconnects.in"], // optional
  });
};

const run = async ({ toAddress, fromAddress, subject, htmlBody, textBody }) => {
  try {
    const sendEmailCommand = createSendEmailCommand({
      toAddress,
      fromAddress,
      subject,
      htmlBody,
      textBody,
    });

    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      return caught; // SES rejected (unverified email, sandbox restriction, etc.)
    }
    throw caught;
  }
};

module.exports = { run };