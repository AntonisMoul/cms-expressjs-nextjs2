"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const StyledLayout = styled_components_1.default.div `
    ul {
        padding-left : 25px;
        list-style : inherit;
    }
`;
const AppLayout = ({ children }) => {
    return (<StyledLayout className="min-h-screen flex flex-col ">
            <div className="flex-grow">{children}</div>
        </StyledLayout>);
};
exports.default = AppLayout;
//# sourceMappingURL=AppLayout.js.map