import React, {useState} from "react";
import {AutoComplete, Button, Card, Col, Form, Input, message, Row, Space, Switch, Checkbox, InputNumber} from "antd";
import {MinusCircleOutlined} from "@ant-design/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faClipboard,
    faFileInvoiceDollar, faListUl,
    faPersonCirclePlus,
    faPlaneDeparture, faUser, faUsers
} from "@fortawesome/free-solid-svg-icons";
import {myApi, width} from "../../resources/service.ts";

interface props {
    onSubmit: (user: string, drivers: Driver[], flight : string, number_of_people : number, price : number, is_advance_paid : boolean, notes : string, checklist: ChecklistEntryDto[]) => void;
}

interface Driver {
    telephone: string;
    name: string;
}

interface ChecklistEntryDto {
    item: string;
    quantity: number;
}

interface OptionType {
    value: string;
    label: React.ReactNode;
}

const checklistOptions = [
    { label: "Young/Old Driver Insurance", value: "YOUNG_OLD_DRIVER_INSURANCE" },
    { label: "Premium Insurance",      value: "PREMIUM_INSURANCE"    },
    { label: "Tank Full",             value: "TANK_FULL"            },
    { label: "BS1",                   value: "BS1"                  },
    { label: "BS2",                   value: "BS2"                  },
    { label: "BS3",                   value: "BS3"                  },
    { label: "BS4",                   value: "BS4"                  },
    { label: "Chains for Snow",       value: "CHAINS_FOR_SNOW"      },
    { label: "Car Play ",       value: "CAR_PLAY"      }
];


const ChooseUser : React.FC<props> = ({ onSubmit}) => {
    const [form] = Form.useForm();
    const [options, setOptions] = useState<OptionType[]>([]);

    const handleUserSearch = async (value: string) => {

        if (!value) {
            try {
                const response = await myApi.get(`user/getAll`);
                const searchResults = response.data.map((user: any) => ({
                    value: user.telephone,
                    label: `${user.telephone}`,
                }));
                setOptions(searchResults);
            } catch (error) {
                console.error("Error searching for users:", error);
                message.error("Failed to search for users.");
            }
        } else {
            try {
                const response = await myApi.get(`user/search?telephone=${value}`);
                const searchResults = response.data.map((user: any) => ({
                    value: user.telephone,
                    label: `${user.telephone}`,
                }));
                setOptions(searchResults);
            } catch (error) {
                console.error("Error searching for users:", error);
                message.error("Failed to search for users.");
            }
        }

    };

    const onSubmitUser = async () => {
        try {
            const values = await form.validateFields();

            console.log(values)

            const {
                telephone,
                drivers = [],
                flight = "",
                number_of_people,
                price,
                is_advance_paid = false,
                notes = "",
                checklist = [],
                checklistQty = []
            } = values;

            if (!telephone) {
                message.warning("Please select a user before submitting");
                return;
            }

            // Build driver list: include all from Form.List plus main telephone
            const driverList: Driver[] = drivers.map((d: any) => ({
                telephone: d.telephone,
                name: d.name,
            }));

            const entries: ChecklistEntryDto[] = [];
            for (const opt of checklistOptions) {

                if (checklist[opt.value]) {
                    if (opt.value.startsWith("BS")) {
                        const count = Number(checklistQty[opt.value]) || 0;
                        if (count > 0) {
                            entries.push({ item: opt.value, quantity: count });
                        }
                    } else {
                        entries.push({ item: opt.value, quantity: 1 });
                    }
                }

            }

            // Ensure main user is included
            //driverList.push({ telephone, name: "" });

            onSubmit(
                telephone,
                driverList,
                flight,
                number_of_people,
                price,
                is_advance_paid,
                notes,
                entries
            );
        } catch {
            // validation errors
        }
    };

    return (
        <div style={{marginTop: "10px", width:'100%', display: "flex", justifyContent: "center", alignContent:'center' }}>
            <Card style={{ borderRadius: '10px', width: `${width * 35}%`, padding: '30px'}} title={"User Details"}>

                <Form form={form} layout="vertical" onFinish={onSubmitUser}>

                    <Form.Item name="telephone" label={<Space><i className="bi bi-telephone"></i> Telephone</Space>}
                               rules={[{required: true, message: "Please input the telephone!"}]}>
                        <AutoComplete<OptionType>
                            onSearch={handleUserSearch}
                            //onSelect={handleSelectUser}
                            options={options}
                            allowClear
                        >
                            <Input placeholder="Telephone"/>
                        </AutoComplete>
                    </Form.Item>

                    <Form.Item name="flight" label={<Space><FontAwesomeIcon icon={faPlaneDeparture} /> Flight</Space>}>
                        <Input placeholder="Flight Number"/>
                    </Form.Item>

                    <Form.Item
                        name="number_of_people"
                        label={<Space><FontAwesomeIcon icon={faUsers} /> Number of People</Space>}
                        rules={[{ required: true, message: "Please enter number of people!" }]}
                    >
                        <Input type="number" placeholder="Number Of People" />
                    </Form.Item>

                    <Form.Item label={<Space><FontAwesomeIcon icon={faListUl}/> Checklist</Space>}>
                        {checklistOptions.map(opt => (
                            <Form.Item
                                key={opt.value}
                                noStyle
                                shouldUpdate={(prev, curr) =>
                                    prev.checklist?.[opt.value] !== curr.checklist?.[opt.value]
                                }
                            >
                                {({ getFieldValue }) => {
                                    const checked = getFieldValue(['checklist', opt.value]);
                                    return (
                                        <Space align="center" style={{ display: 'flex', marginBottom: 8 }}>
                                            <Form.Item
                                                name={['checklist', opt.value]}
                                                valuePropName="checked"
                                                noStyle
                                            >
                                                <Checkbox>{opt.label}</Checkbox>
                                            </Form.Item>

                                            {opt.value.startsWith('BS') && checked && (
                                                <Form.Item
                                                    name={['checklistQty', opt.value]}
                                                    rules={[{ required: true, message: 'Enter quantity' }]}
                                                    noStyle
                                                >
                                                    <InputNumber min={1} placeholder="Qty" />
                                                </Form.Item>
                                            )}
                                        </Space>
                                    );
                                }}
                            </Form.Item>
                        ))}
                    </Form.Item>

                    <Form.Item name="notes" label={<Space><FontAwesomeIcon icon={faClipboard} /> Notes</Space>}>
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.List name="drivers">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, index) => (
                                    <Row
                                        key={field.key}
                                        gutter={10}
                                        align="middle"
                                        style={{ marginBottom: 16 }}
                                    >
                                        <Col flex="40px" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                            {index + 2}.
                                        </Col>
                                        <Col flex="auto">
                                            <Form.Item
                                                // override to nest into the driver object:
                                                name={[field.name, "telephone"] as any}
                                                label={
                                                    <Space>
                                                        <i className="bi bi-telephone" />
                                                        Driver Telephone
                                                    </Space>
                                                }
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Please enter a telephone number",
                                                    },
                                                ]}
                                            >
                                                <AutoComplete allowClear>
                                                    <Input placeholder="Enter telephone" />
                                                </AutoComplete>
                                            </Form.Item>
                                        </Col>
                                        <Col flex="auto">
                                            <Form.Item
                                                name={[field.name, "name"] as any}
                                                label={
                                                    <Space>
                                                        <FontAwesomeIcon icon={faUser} />
                                                        Driver Name
                                                    </Space>
                                                }
                                                rules={[{ required: true, message: "Please enter a name" }]}
                                            >
                                                <AutoComplete allowClear>
                                                    <Input placeholder="Enter name" />
                                                </AutoComplete>
                                            </Form.Item>
                                        </Col>
                                        <Col>
                                            <MinusCircleOutlined
                                                onClick={() => remove(field.name)}
                                                style={{ fontSize: 16, color: "red", cursor: "pointer" }}
                                            />
                                        </Col>
                                    </Row>
                                ))}

                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        icon={<FontAwesomeIcon icon={faPersonCirclePlus} />}
                                        block
                                    >
                                        Add A Driver
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>


                    <div style={{display: "flex", justifyContent: "center", marginTop: "40px"}}>
                        <Space size="large">
                            <Button type="primary" htmlType="submit" icon={<i className="bi bi-check-square"></i>}>
                                Submit
                            </Button>
                        </Space>
                    </div>

                </Form>
            </Card>

            {/* Action Buttons */}



        </div>
    );
}

export default ChooseUser;