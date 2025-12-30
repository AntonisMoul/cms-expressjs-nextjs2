
import React, { ReactNode } from "react";

import styled from "styled-components";

type AppLayoutProps = {
    children: ReactNode;
};

const StyledLayout = styled.div`
    ul {
        padding-left : 25px;
        list-style : inherit;
    }
`

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    return (
        <StyledLayout className="min-h-screen flex flex-col ">
            <div className="flex-grow">{children}</div>
        </StyledLayout>
    );
};

export default AppLayout;

