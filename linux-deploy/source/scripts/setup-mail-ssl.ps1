$SERVER_IP = "76.13.248.9"
$SERVER_USER = "root"
$SERVER_PASS = ".5Lc&RN2cQexmwLU?ETf"
$HOST_KEY = "SHA256:1LlhuwCE3vVlqe3wyKOuz3Hrd42q6W40dvHmDqbhZL8"

Write-Host "Installing Certbot and generating SSL..."
$cmd = "apt-get update && apt-get install -y certbot; certbot certonly --standalone -d mail.beyondlimitsturkiye.tech --non-interactive --agree-tos --email info@beyondlimitsturkiye.tech"
plink -batch -hostkey $HOST_KEY -pw $SERVER_PASS "${SERVER_USER}@${SERVER_IP}" $cmd

Write-Host "Configuring Postfix for SSL..."
$postCmd = "postconf -e 'smtpd_tls_cert_file = /etc/letsencrypt/live/mail.beyondlimitsturkiye.tech/fullchain.pem'; postconf -e 'smtpd_tls_key_file = /etc/letsencrypt/live/mail.beyondlimitsturkiye.tech/privkey.pem'; systemctl restart postfix"
plink -batch -hostkey $HOST_KEY -pw $SERVER_PASS "${SERVER_USER}@${SERVER_IP}" $postCmd

Write-Host "Configuring Dovecot for SSL..."
$dovCmd = "sed -i 's|^ssl_cert =.*|ssl_cert = </etc/letsencrypt/live/mail.beyondlimitsturkiye.tech/fullchain.pem|' /etc/dovecot/conf.d/10-ssl.conf; sed -i 's|^ssl_key =.*|ssl_key = </etc/letsencrypt/live/mail.beyondlimitsturkiye.tech/privkey.pem|' /etc/dovecot/conf.d/10-ssl.conf; systemctl restart dovecot"
plink -batch -hostkey $HOST_KEY -pw $SERVER_PASS "${SERVER_USER}@${SERVER_IP}" $dovCmd

Write-Host "Server configuration complete."
