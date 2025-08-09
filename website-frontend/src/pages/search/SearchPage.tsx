import React, {useCallback, useEffect, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {
    AutoComplete,
    Button,
    Card,
    Col, DatePicker,
    Form,
    Input,
    List,
    message,
    Popover,
    Row,
    Space,
} from "antd";
import {
    faCalendar
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {myApi, width, height} from "../../resources/service.ts";
import DateForm from "../../components/search/DateForm.tsx";
import AvailabilityCard from "../../components/search/AvailabilityCard.tsx";

const {RangePicker} = DatePicker;


interface props {
    onSubmit: (temp: Partial<Booking>) => void;
}

interface DriverDto {
    telephone: string;
    name: string;
    last_name: string;
    driver_license: string;
}

interface Booking {
    telephone: string;
    category_id: number;
    start: Dayjs;
    end: Dayjs;
    drivers: DriverDto[]; // Update from string[] to DriverDto[]
    price: number;
    startLocation: string;
    endLocation: string;
}

interface myDateForm {
    startLocation: string;
    endLocation: string;
    start: Dayjs | null;
    end: Dayjs | null;
}

interface Category {
    id: number,
    name: string;
    type: string,
    fuel: string,
    numOfSeats: number,
    pricePerDay: number,
    automatic: boolean,
    imageUrl: string,
    color: string
    description: string;

}

interface Availability {
    category: Category;
    totalPrice: number;
    averagePricePerDay: number;
}

interface OptionType {
    value: string;
    label: React.ReactNode;
}
function SearchPage({ onSubmit}) {
    const [availabilities, setAvailabilities] = useState<Availability[]>([]);
    const [myDates, setMyDates] = useState<myDateForm>();
    const [searchParams, setSearchParams] = useState({
        category_name: "",
        type: "",
        fuel: "",
        numOfSeats: undefined as number | undefined, // undefined to indicate optional
        automatic: undefined as boolean | undefined, // undefined to indicate optional
    });
    const [dateParams, setDateParams] = useState<{ start: Dayjs | null; end: Dayjs | null }>({
        start: dayjs().add(1, 'day'), // Tomorrow at the same time
        end: dayjs().add(2, 'day'),   // Two days from now at the same time
    });
    const [form] = Form.useForm();
    const [popoverVisible, setPopoverVisible] = useState(false);
    const locationOptions = [
        { value: "Skypark", label: "Skypark" },
        { value: "4Rent Office", label: "4Rent Office" },
        { value: "Thessaloniki Hotel/Airnbnb", label: "Thessaloniki Hotel/Airnbnb" },
    ];




    const fetchCategoryIds = useCallback(() => {

        console.log("Search with query");
        console.log("Search parameters: ", searchParams, dateParams)

        myApi.get(`availability/search`, {
            params: {
                name: searchParams.category_name,
                type: searchParams.type,
                fuel: searchParams.fuel,
                ...(searchParams.numOfSeats !== undefined && { numOfSeats: searchParams.numOfSeats }),
                ...(searchParams.automatic !== undefined && { automatic: searchParams.automatic }), // Only include automatic if the switch is disabled (false)
                start: dateParams.start?.format('YYYY-MM-DDTHH:mm'),
                end: dateParams.end?.format('YYYY-MM-DDTHH:mm'),
            }
        }).then(response => {
            console.log(response.data)
            setAvailabilities(response.data);
        })
            .catch(error => {
                message.error('Failed to fetch availabilities');
                console.log("Error: "+ error);
                setAvailabilities([]);
            }).finally( () => {
        });

    }, [dateParams, searchParams]);


    useEffect(() => {

    }, [fetchCategoryIds, searchParams, dateParams]);

    const handleSelect = (id: number) => {
        console.log("Selected category ID:", id);
        if (myDates && myDates.start !== null && myDates.end !== null && myDates.startLocation && myDates.endLocation) {
            const selectedCategory = availabilities.find(av => av.category.id === id);
            if (!selectedCategory) {
                message.error("Selected category not found.");
                return;
            }

            const booking: Partial<Booking> = {
                category_id: id,
                start: myDates.start,
                end: myDates.end,
                price: selectedCategory.totalPrice,
                startLocation: myDates.startLocation,
                endLocation: myDates.endLocation,
            };

            onSubmit(booking);
        } else {
            message.warning("Please select dates, insert locations, and press search before submitting.");
        }
    };


    const handleDatesSubmit = (dateForm : myDateForm) => {
        console.log(dateForm)
        setMyDates(dateForm);
    };

    const handleDatesChange = (start: Dayjs, end: Dayjs) => {
        console.log(start, end)
        setDateParams({ start, end });
    }

    const handleCategoryChange = (name: string, value: string | number | boolean | null) => {
        console.log(name, value)
        setSearchParams(prev => ({ ...prev, [name]: value })); // Correctly use dynamic property name
    };

    const clearAll = () => {
        setSearchParams({
            category_name: "",
            type: "",
            fuel: "",
            numOfSeats: undefined,
            automatic: undefined,
        });
    };

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const { startLocation, endLocation, dateRange } = values;
            const [start, end] = dateRange;
            const dateForm: myDateForm = {
                startLocation,
                endLocation,
                start,
                end
            };
            handleDatesChange(start, end);
            handleDatesSubmit(dateForm);
            setPopoverVisible(false)
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            startLocation: "", // Default value for startLocation
            endLocation: "",   // Default value for endLocation
            dateRange: [dayjs().add(1, 'day').minute(0), dayjs().add(2, 'day').minute(0)], // Default date range
        });
    }, [form]);

    const bookingFiltersContent = (
        <div style={{
            marginInline: "10px",
            maxHeight: height > 1.5 ? "300px" : "350px",
            overflowY: "auto",
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: "#fff",
            width: "230px",
            margin: "auto",
            overflowX: "hidden"
        }}>
            <Form layout="vertical" onFinish={handleSubmit} form={form}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="startLocation"
                            label="Pick Up At"
                            rules={[{ required: true, message: 'Please enter pick location' }]}
                            validateTrigger="onSubmit"
                        >

                            <AutoComplete<OptionType>
                                options={locationOptions}
                            >
                                <Input prefix={<i className="bi bi-geo-alt"></i>} placeholder="Airport or Anywhere" />
                            </AutoComplete>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="endLocation"
                            label="Drop Off At"
                            rules={[{ required: true, message: 'Please enter drop off location' }]}
                            validateTrigger="onSubmit"
                        >

                            <AutoComplete<OptionType>
                                options={locationOptions}
                            >
                                <Input prefix={<i className="bi bi-geo-alt"></i>} placeholder="Airport or Anywhere" />
                            </AutoComplete>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
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
                    </Col>
                </Row>
                <Form.Item style={{ display: "flex",justifyContent: "right"}}>
                    <Button color="primary" variant="outlined" htmlType="submit" >
                        Search
                    </Button>
                </Form.Item>

            </Form>
        </div>
    );
    return (
        <div
            style={{
                margin: '20px auto',
            }}
        >

            {width < 3.4 ?
                <>
                    <Card style={{
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignContent: 'center',
                        width: '100%',
                        backgroundColor: '#F7F2EC'
                    }} title={"Pick dates"}>
                        <DateForm onDateFormChange={handleDatesChange} onDateFormSubmit={handleDatesSubmit}/>
                    </Card>
                    <Row style={{justifyContent:'center', display: 'flex'}}>
                        <Col
                             style={{
                                 marginTop: '30px',
                                 display: 'flex',
                                 flexWrap: 'wrap',
                                 justifyContent: 'space-between'
                             }}>
                            <div>
                                <List
                                    grid={{
                                        gutter: 16,
                                        column: width >= 3.2 ? 1 : width >= 2 ? 2 : width >= 1.28 ? 3 : 4

                                    }}
                                    dataSource={availabilities}

                                    renderItem={(av: Availability) => (
                                        <List.Item key={av.category.id}>
                                            <AvailabilityCard av={av} onSelect={handleSelect}/>
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </Col>
                    </Row>
                </>
                :
                <div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '30px'
                    }}>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'left',
                            alignItems: 'center',
                            overflowX: "hidden"
                        }}>
                            <Popover
                                placement={"bottomRight"} // Ensure `placement` is one of the allowed values
                                content={bookingFiltersContent} trigger="click" style={{alignItems: 'center'}}
                                open={popoverVisible}
                                onOpenChange={setPopoverVisible}>
                                <Button icon={<FontAwesomeIcon icon={faCalendar}/>}>
                                    Select Dates & Loc/s
                                </Button>
                            </Popover>
                        </div>


                    </div>

                    <List
                        grid={{
                            gutter: 16,
                            column: width >= 3 ? 1 : width >= 1.6 ? 2 : width >= 1.28 ? 3 : 4
                        }}
                        dataSource={availabilities}
                        style={{marginTop: '10px'}}

                        renderItem={(av: Availability) => (
                            <List.Item key={av.category.id}>
                                <AvailabilityCard av={av} onSelect={handleSelect}/>
                            </List.Item>
                        )}
                    />
                </div>
            }

        </div>
    );
}

export default SearchPage;