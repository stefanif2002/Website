import React, {useEffect, useState} from 'react';
import dayjs, {Dayjs} from "dayjs";
import {AutoComplete, Button, Col, DatePicker, Form, Input, Row, Select, Space} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar} from "@fortawesome/free-solid-svg-icons";
import {width} from "../../resources/service.ts";

const { RangePicker } = DatePicker;

interface DateFormProps {
    onDateFormSubmit: (dateForm: myDateForm) => void;
    onDateFormChange: (start: Dayjs, end: Dayjs) => void;
}

interface myDateForm {
    startLocation: string | null;
    endLocation: string | null;
    start: Dayjs | null;
    end: Dayjs | null;

}

interface OptionType {
    value: string;
    label: React.ReactNode;
}

const DateForm: React.FC<DateFormProps> = ({ onDateFormChange, onDateFormSubmit }) => {
    const [form] = Form.useForm();
    const locationOptions = [
        { value: "Skypark", label: "Skypark" },
        { value: "4Rent Office", label: "4Rent Office" },
        { value: "Thessaloniki Hotel/Airnbnb", label: "Thessaloniki Hotel/Airnbnb" },
    ];
    const [startLocation, setStartLocation] = useState<string | null>(null);
    const [endLocation, setEndLocation] = useState<string | null>(null);


    useEffect(() => {
        setStartLocation("4Rent Office");
        setEndLocation("4Rent Office");

        form.setFieldsValue({
            startLocation: "4Rent Office",
            endLocation: "4Rent Office",
            dateRange: [dayjs().add(1, 'day').minute(0), dayjs().add(2, 'day').minute(0)], // Default date range
        });
    }, [form]);


    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const { dateRange } = values;
            const [start, end] = dateRange;
            const dateForm: myDateForm = {
                startLocation,
                endLocation,
                start,
                end
            };
            onDateFormChange(start, end);
            onDateFormSubmit(dateForm);
        });
    };

    const handleDatesSearch = (name: string, value: [dayjs.Dayjs , dayjs.Dayjs ]) => {
        const [start, end] = value;
        onDateFormChange(start, end);
    }



    return (
        <div style={{justifyContent: 'center', display: 'flex', width: '100%',}}>

            <Form
            form={form}
            onFinish={handleSubmit}
            style={{
                padding: '0 20px',
                display: 'flex',
            }}
        >
                {width >= 1.9 ? (
                    <>
                        <Row>
                            <Col>
                                <Form.Item
                                    name="startLocation"
                                    label="Pick Up At"
                                    rules={[{ required: true, message: 'Please enter pick location' }]}
                                    validateTrigger="onSubmit"
                                >
                                    <Select
                                        placeholder="Airport or Anywhere"
                                        options={locationOptions}
                                        onChange={setStartLocation}
                                        style={{ minWidth: 120 }}
                                        // if you want the icon inside the select’s trigger instead of outside:
                                        suffixIcon={<i className="bi bi-geo-alt" />}
                                    />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item
                                    name="endLocation"
                                    label="Drop Off At"
                                    rules={[{ required: true, message: 'Please enter drop off location' }]}
                                    validateTrigger="onSubmit"
                                >
                                    <Select
                                        placeholder="Airport or Anywhere"
                                        options={locationOptions}
                                        onChange={setEndLocation}
                                        style={{ minWidth: 120, flex: 'auto' }}
                                        // if you want the icon inside the select’s trigger instead of outside:
                                        suffixIcon={<i className="bi bi-geo-alt" />}
                                    />
                                </Form.Item>
                            </Col>

                        </Row>
                        {/* Second row: date range and search button */}
                        <Row>
                            <Form.Item
                                name="dateRange"
                                label={<Space><FontAwesomeIcon icon={faCalendar} /> Dates</Space>}
                                rules={[{ required: true, message: 'Please select the dates!' }]}
                            >
                                <RangePicker
                                    style={{ width: '100%' }}
                                    showTime={{ format: 'HH:mm', minuteStep: 15 }}
                                    format="DD-MMM-YYYY, HH:mm"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button color="primary" variant="outlined" htmlType="submit">
                                    Search
                                </Button>
                            </Form.Item>
                        </Row>
                    </>
                ) : (
                    // Single-row layout for smaller widths
                    <Space size="large">
                        <Form.Item
                            name="startLocation"
                            label="Pick Up At"
                            rules={[{ required: true, message: 'Please enter pick location' }]}
                            validateTrigger="onSubmit"
                        >
                            <Select
                                placeholder="Airport or Anywhere"
                                options={locationOptions}
                                onChange={setStartLocation}
                                style={{ minWidth: 200 }}
                                // if you want the icon inside the select’s trigger instead of outside:
                                suffixIcon={<i className="bi bi-geo-alt" />}
                            />
                        </Form.Item>
                        <Form.Item
                            name="endLocation"
                            label="Drop Off At"
                            rules={[{ required: true, message: 'Please enter drop off location' }]}
                            validateTrigger="onSubmit"
                        >
                            <Select
                                placeholder="Airport or Anywhere"
                                options={locationOptions}
                                onChange={setEndLocation}
                                style={{ minWidth: 200 }}
                                // if you want the icon inside the select’s trigger instead of outside:
                                suffixIcon={<i className="bi bi-geo-alt" />}
                            />
                        </Form.Item>
                        <Form.Item
                            name="dateRange"
                            label={<Space><FontAwesomeIcon icon={faCalendar} /> Dates</Space>}
                            rules={[{ required: true, message: 'Please select the dates!' }]}
                        >
                            <RangePicker
                                style={{ width: '100%' }}
                                showTime={{ format: 'HH:mm', minuteStep: 15 }}
                                format="DD-MMM-YYYY, HH:mm"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button color="primary" variant="outlined" htmlType="submit">
                                Search
                            </Button>
                        </Form.Item>
                    </Space>
                )}
        </Form>
        </div>
    );
}

export default DateForm;