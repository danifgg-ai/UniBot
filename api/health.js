export default function handler(req, res) {
  const {
    OCI_TENANCY_OCID,
    OCI_USER_OCID,
    OCI_FINGERPRINT,
    OCI_PRIVATE_KEY_CONTENT,
    OCI_REGION,
    OCI_AGENT_ENDPOINT_ID,
  } = process.env;

  const allVarsPresent = !!(
    OCI_TENANCY_OCID &&
    OCI_USER_OCID &&
    OCI_FINGERPRINT &&
    OCI_PRIVATE_KEY_CONTENT &&
    OCI_AGENT_ENDPOINT_ID
  );

  res.json({
    status: allVarsPresent ? 'ok' : 'error',
    clientInitialized: allVarsPresent,
    agentConfigured: !!OCI_AGENT_ENDPOINT_ID,
    region: OCI_REGION || 'sa-saopaulo-1',
    initError: allVarsPresent ? null : 'Faltan variables de entorno OCI en Vercel',
  });
}
