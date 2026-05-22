<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$mail = new PHPMailer(true);

try {

    // SMTP SETTINGS
    $mail->isSMTP();
    $mail->Host       = 'mail.al-ihsanzakat.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'applications@al-ihsanzakat.com';
    $mail->Password   = 'YOUR_EMAIL_PASSWORD';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 465;

    // FROM + TO
    $mail->setFrom('applications@al-ihsanzakat.com', 'AZSF Application');
    $mail->addAddress('alihsanzakatsadaqat@gmail.com');

    // USER EMAIL REPLY
    if(isset($_POST['Email'])) {
        $mail->addReplyTo($_POST['Email']);
    }

    // FILE ATTACHMENT
   $allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

if(isset($_FILES['Attachment']) && $_FILES['Attachment']['error'] == 0){

    if(in_array($_FILES['Attachment']['type'], $allowedTypes)){

        if($_FILES['Attachment']['size'] <= 5000000){

            $mail->addAttachment(
                $_FILES['Attachment']['tmp_name'],
                $_FILES['Attachment']['name']
            );

        } else {
            die("File too large.");
        }

    } else {
        die("Invalid file type.");
    }
}

    // EMAIL FORMAT
    $mail->isHTML(true);
    $mail->Subject = 'New Zakat Application Form';

    // BUILD MESSAGE
    $body = "
    <h2>New Application Received</h2>

    <table border='1' cellpadding='10' cellspacing='0'>
        <tr><td><strong>Religion</strong></td><td>{$_POST['Religion']}</td></tr>
        <tr><td><strong>First Name</strong></td><td>{$_POST['Firstname']}</td></tr>
        <tr><td><strong>Last Name</strong></td><td>{$_POST['Lastname']}</td></tr>
        <tr><td><strong>Gender</strong></td><td>{$_POST['Gender']}</td></tr>
        <tr><td><strong>Date Of Birth</strong></td><td>{$_POST['Date Of Birth']}</td></tr>

        <tr><td><strong>Email</strong></td><td>{$_POST['Email']}</td></tr>
        <tr><td><strong>Telephone</strong></td><td>{$_POST['Telephone']}</td></tr>
        <tr><td><strong>Address</strong></td><td>{$_POST['Address']}</td></tr>
        <tr><td><strong>Country</strong></td><td>{$_POST['Country']}</td></tr>
        <tr><td><strong>City</strong></td><td>{$_POST['City']}</td></tr>
        <tr><td><strong>Postcode</strong></td><td>{$_POST['Postcode']}</td></tr>

        <tr><td><strong>Living Status</strong></td><td>{$_POST['Living Status']}</td></tr>
        <tr><td><strong>Children Count</strong></td><td>{$_POST['Children Count']}</td></tr>
        <tr><td><strong>Housing Situation</strong></td><td>{$_POST['Housing Situation']}</td></tr>
        <tr><td><strong>Disability</strong></td><td>{$_POST['Disability']}</td></tr>
        <tr><td><strong>Applied Relief</strong></td><td>{$_POST['Applied Relief']}</td></tr>

        <tr><td><strong>Identification Method</strong></td><td>{$_POST['Idetification Method']}</td></tr>
        <tr><td><strong>Paypal</strong></td><td>{$_POST['Paypal']}</td></tr>
        <tr><td><strong>Work Status</strong></td><td>{$_POST['Work Status']}</td></tr>
        <tr><td><strong>Monthly Benefits</strong></td><td>{$_POST['Monthly Benefits']}</td></tr>
        <tr><td><strong>Monthly Benefits Amount</strong></td><td>{$_POST['Monthly Benefits Amount']}</td></tr>

        <tr><td><strong>Bank Account Amount</strong></td><td>{$_POST['Bank Account Amount']}</td></tr>
        <tr><td><strong>Gold Or Silver</strong></td><td>{$_POST['Gold Or Silver']}</td></tr>
        <tr><td><strong>Monthly Income</strong></td><td>{$_POST['Monthly Income']}</td></tr>
        <tr><td><strong>Debts</strong></td><td>{$_POST['Debts']}</td></tr>
        <tr><td><strong>Rent</strong></td><td>{$_POST['Rent']}</td></tr>

        <tr><td><strong>Financial Challenges</strong></td><td>{$_POST['Financial Challenges']}</td></tr>
        <tr><td><strong>Zakat Help</strong></td><td>{$_POST['Zakat Help']}</td></tr>
    </table>
    ";

    $mail->Body = $body;

    // SEND EMAIL
    $mail->send();

    // REDIRECT
    header("Location: thanks.html");
    exit();

} catch (Exception $e) {

    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>