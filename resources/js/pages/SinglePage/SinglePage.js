"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const SEO_1 = __importDefault(require("@/utils/SEO"));
const AppLayout_1 = __importDefault(require("@/layouts/AppLayout"));
const SinglePage = (props) => {
    return (<AppLayout_1.default>
            <section className="single-page-section">
                <SEO_1.default seo={props.page.data.seo}/>
                {props.page.data.image && (<div className="single-page-image-container">
                        <img src={props.page.data.image} alt="main-image"/>
                    </div>)}
                <div className="single-page-container">
                    <h1 className="single-page-title">{props.page.data.name}</h1>
                    <div className="single-page-content" dangerouslySetInnerHTML={{
            __html: props.page.data.content,
        }}/>
                </div>
            </section>
        </AppLayout_1.default>);
};
exports.default = SinglePage;
//# sourceMappingURL=SinglePage.js.map