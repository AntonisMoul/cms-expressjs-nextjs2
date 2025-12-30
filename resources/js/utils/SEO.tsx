import { Helmet } from "react-helmet-async"

type SEOProps = {
    seo: {
        description: string
        metaKeywords: string | null
        title: string
    }
}

const SEO: React.FC<SEOProps> = ({ seo }) => {

    return (
        <Helmet prioritizeSeoTags >
            <title>{seo?.title}</title>
            <meta name='description' content={seo?.description} />
            <meta name="keywords" content={seo?.metaKeywords} />
        </Helmet>
    )


}

export default SEO
