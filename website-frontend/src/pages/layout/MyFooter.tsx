import React from "react";
import {Col, Layout, Row} from "antd";

const { Footer } = Layout;


function MyFooter () {
    return (
        <Footer
            style={{textAlign: 'start', backgroundColor: 'rgba(229,230,232,0.8)', width: '100%', justifyContent: 'center'}}>
            <Row gutter={16} style={{width: '80%'}}>
                <Col span={8}>
                    <h3>Τηλ. πληροφορίες</h3>
                    <div>Τηλέφωνο Γραφείο</div>
                    <div>+30 2310 460035</div>
                    <div>Κινητό</div>
                    <div>+30 6982 211 001</div>
                    <div>WhatsApp, Viber μόνο Μηνύματα</div>
                    <div>+30 697 3832 625</div>
                    <div>Ακολουθήστε μας στα Social Media</div>
                    <div>
                        <a href="https://facebook.com" style={{ marginRight: '10px' }}>Facebook</a>
                        <a href="https://instagram.com" style={{ marginRight: '10px' }}>Instagram</a>
                        <a href="https://tiktok.com" style={{ marginRight: '10px' }}>Tiktok</a>
                        <a href="https://youtube.com">Youtube</a>
                    </div>
                </Col>
                <Col span={8}>

                </Col>
                <Col span={8}>

                </Col>
            </Row>
        </Footer>
    );
}

export default MyFooter;