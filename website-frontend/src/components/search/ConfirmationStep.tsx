import { AutoComplete, Button, Col, Form, Input, InputNumber, Row, Space } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faPlaneDeparture, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import type { FormInstance } from "antd/es/form";


type Props = {
    form: FormInstance;            // AntD FormInstance
    onPrev: () => void;
    onFinish: () => void; // parent will validate & submit
};

export default function ConfirmationStep({ onPrev, onFinish }: Props) {

    return (
        <div>
            <Form.Item
                name="telephone"
                label={<Space><i className="bi bi-telephone" /> Τηλέφωνο</Space>}
                rules={[{ required: true, message: "Please input the telephone!" }]}
            >
                <Input placeholder="Telephone" />
            </Form.Item>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item name="flight" label={<Space><FontAwesomeIcon icon={faPlaneDeparture} /> Πτήση</Space>}>
                        <Input placeholder="Flight Number" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="number_of_people"
                        label={<Space><FontAwesomeIcon icon={faUsers} /> Άτομα</Space>}
                        rules={[{ required: true, message: "Please enter number of people!" }]}
                    >
                        <InputNumber style={{ width: "100%" }} min={1} placeholder="Number Of People" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item name="notes" label={<Space><FontAwesomeIcon icon={faClipboard} /> Σημειώσεις</Space>}>
                <Input.TextArea rows={4} />
            </Form.Item>

            <Form.List name="drivers">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map((field, index) => (
                            <Row key={field.key} gutter={10} align="middle" style={{ marginBottom: 16 }}>
                                <Col flex="40px" style={{ textAlign: "center", fontWeight: "bold" }}>
                                    {index + 2}.
                                </Col>
                                <Col flex="auto">
                                    <Form.Item
                                        name={[field.name, "telephone"] as [number, "telephone"]}
                                        label={<Space><i className="bi bi-telephone" /> Τηλέφωνο οδηγού</Space>}
                                        rules={[{ required: true, message: "Enter a telephone" }]}
                                    >
                                        <AutoComplete allowClear>
                                            <Input placeholder="Enter telephone" />
                                        </AutoComplete>
                                    </Form.Item>
                                </Col>
                                <Col flex="auto">
                                    <Form.Item
                                        name={[field.name, "name"] as [number, "name"]}
                                        label={<Space><FontAwesomeIcon icon={faUser} /> Όνομα οδηγού</Space>}
                                        rules={[{ required: true, message: "Enter a name" }]}
                                    >
                                        <AutoComplete allowClear>
                                            <Input placeholder="Enter name" />
                                        </AutoComplete>
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <MinusCircleOutlined onClick={() => remove(field.name)} style={{ fontSize: 16, color: "red" }} />
                                </Col>
                            </Row>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block>
                                Προσθήκη οδηγού
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>

            <Row justify="space-between">
                <Col><Button onClick={onPrev}>ΠΙΣΩ</Button></Col>
                <Col><Button type="primary" onClick={onFinish}>ΣΥΝΕΧΕΙΑ</Button></Col>
            </Row>
        </div>
    );
}
