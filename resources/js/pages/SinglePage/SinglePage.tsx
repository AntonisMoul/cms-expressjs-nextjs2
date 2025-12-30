import React from "react";
import SEO from "@/utils/SEO";
import AppLayout from "@/layouts/AppLayout";

const SinglePage: React.FC<SinglePageProps> = (props) => {
    return (
        <AppLayout>
            <section className="single-page-section">
                <SEO seo={props.page.data.seo} />
                {props.page.data.image && (
                    <div className="single-page-image-container">
                        <img
                            src={props.page.data.image}
                            alt="main-image"
                        />
                    </div>
                )}
                <div className="single-page-container">
                    <h1 className="single-page-title">{props.page.data.name}</h1>
                    <div
                        className="single-page-content"
                        dangerouslySetInnerHTML={{
                            __html: props.page.data.content,
                        }}
                    />
                </div>
            </section>
        </AppLayout>
    );
};

export default SinglePage;

interface MenuItem {
    title: string;
    url: string;
    target: string;
    child: MenuItem[];
}

interface PageContent {
    content: string;
    description: string;
    image: string | null;
    name: string;
    seo: {
        description: string;
        metaKeywords: string | null;
        title: string;
    };
    slug: string;
}

interface SocialLink {
    name: string;
    link: string;
    icon: string;
    image: string | null;
}

interface SinglePageProps {
    copyright: string;
    data: any[];
    errors: Record<string, any>;
    favicon: string;
    headerLogo1: string;
    isAuth: boolean;
    member: any | null;
    menus: {
        footer: MenuItem[];
        header: MenuItem[];
    };
    message: string | null;
    page: {
        data: PageContent;
    };
    social: SocialLink[];
}
