import axios from "axios";
import ToastService from "../../Toast/ToastService";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import { updateApartment } from "../../../Store/ApartmentSlice";
import { useEffect } from "react";

const Leave = (props) => {
    const ACCESS_TOKEN = useSelector((myStore) => myStore.token.token);
    const allApartment = useSelector((myStore) => myStore.Allapartments.Allapartments);
    const dispatch = useDispatch();
    console.log(props.apartment_id);

    const handLeft = async () => {
        try {
            const res = await axios.post('http://localhost:7000/apartment/leave', {
                id: props.apartment_id[0]
            }, {
                headers: {
                    Authorization: "Bearer " + ACCESS_TOKEN
                }
            });
            if (res.status < 400) {
                const updateAllApartments = allApartment.filter(a => a._id != props.apartment_id[0])
                dispatch(updateApartment(updateAllApartments));
                ToastService.show('success', 'הצלחה', 'משפחת ' + props.lastName + " עזבה", 3000);
            }
            else {
                ToastService.show('error', ' 400 שגיאה', "", 3000);
            }

        } catch (error) {
            ToastService.show('error', 'שגיאה', "", 3000);
        }
    }

    useEffect(() => {
        handLeft();
    }, [])
    return (<>
    </>)
}

export default Leave