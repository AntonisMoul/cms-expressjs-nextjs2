"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_helmet_async_1 = require("react-helmet-async");
const SEO = ({ seo }) => {
    return (<react_helmet_async_1.Helmet prioritizeSeoTags>
            <title>{seo?.title}</title>
            <meta name='description' content={seo?.description}/>
            <meta name="keywords" content={seo?.metaKeywords}/>
        </react_helmet_async_1.Helmet>);
};
exports.default = SEO;
//# sourceMappingURL=SEO.js.map