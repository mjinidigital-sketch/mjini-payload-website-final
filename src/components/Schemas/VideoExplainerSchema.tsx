export const videoExplainerSchema = (props: any) => {
  const baseUrl = 'https://mjinidigital.co.ke'

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': `${baseUrl}/#explainer-video`,
    name: 'Our Web Design & SEO Process | Mjini Digital Nairobi',
    description:
      'A deep look into how Mjini Digital builds high-converting, mobile-friendly websites and sets up technical SEO for brands in Kenya.',
    thumbnailUrl: [`${baseUrl}/assets/video-thumbnail.jpg`],
    uploadDate: '2026-01-15T08:00:00+03:00', // East Africa Time Zone
    contentUrl: props.videoUrl || 'https://mjinidigital.co.ke',
    embedUrl: props.embedUrl || 'https://youtube.com',
    publisher: {
      '@type': 'ProfessionalService',
      '@id': `${baseUrl}/#organization`,
    },
  }
}

// If you have a video on your homepage or landing pages
//  (e.g., explaining your web design process), this schema forces
//  Google to show a video thumbnail next to your site in search results,
//  massively driving up clicks.
