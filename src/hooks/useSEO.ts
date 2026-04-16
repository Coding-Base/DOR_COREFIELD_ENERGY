import { useEffect } from 'react'

interface SEOConfig {
  title: string
  description: string
  keywords?: string
  canonical?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
}

/**
 * Custom hook to manage SEO meta tags dynamically
 * Updates page title, meta description, and other SEO-related tags
 */
export const useSEO = (config: SEOConfig) => {
  useEffect(() => {
    // Update page title
    document.title = config.title

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', config.description)
    } else {
      metaDescription = document.createElement('meta')
      metaDescription.name = 'description'
      metaDescription.content = config.description
      document.head.appendChild(metaDescription)
    }

    // Update meta keywords
    if (config.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]')
      if (metaKeywords) {
        metaKeywords.setAttribute('content', config.keywords)
      } else {
        metaKeywords = document.createElement('meta')
        metaKeywords.name = 'keywords'
        metaKeywords.content = config.keywords
        document.head.appendChild(metaKeywords)
      }
    }

    // Update canonical URL
    if (config.canonical) {
      let canonical = document.querySelector('link[rel="canonical"]')
      if (canonical) {
        canonical.setAttribute('href', config.canonical)
      } else {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        canonical.href = config.canonical
        document.head.appendChild(canonical)
      }
    }

    // Update Open Graph tags
    if (config.ogImage) {
      let ogImage = document.querySelector('meta[property="og:image"]')
      if (ogImage) {
        ogImage.setAttribute('content', config.ogImage)
      }
    }

    if (config.ogType) {
      let ogType = document.querySelector('meta[property="og:type"]')
      if (ogType) {
        ogType.setAttribute('content', config.ogType)
      }
    }

    // Update Twitter Card tags
    if (config.twitterCard) {
      let twitterCard = document.querySelector('meta[property="twitter:card"]')
      if (twitterCard) {
        twitterCard.setAttribute('content', config.twitterCard)
      }
    }

    // Scroll to top on page change
    window.scrollTo(0, 0)
  }, [config])
}

export default useSEO
