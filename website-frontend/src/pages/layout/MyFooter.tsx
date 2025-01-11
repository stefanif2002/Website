import React from "react";
import {Layout} from "antd";

const { Footer } = Layout;


function MyFooter () {
    return (
        <Footer
            style={{textAlign: 'center', backgroundColor: 'rgba(229,230,232,0.8)', width: '100%'}}>
            Car Rental CRM ©{new Date().getFullYear()} Created by Stefanos Yfoulis
        </Footer>
    );
}

export default MyFooter;