import React from "react";
declare const SinglePage: React.FC<SinglePageProps>;
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
//# sourceMappingURL=SinglePage.d.ts.map