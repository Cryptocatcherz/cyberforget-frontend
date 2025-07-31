// Or wherever your site links are being generated
const formatSiteName = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// When generating links
<Link to={`/delete-account/how-to-delete-my-account-on-${formatSiteName(site.name)}`}>
  {site.name}
</Link> 