"use client";
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";

export default function CreateMerchantPage() {
    const [merchantData, setMerchantData] = useState({
        nombre: "",
        email: "",
        password: "",
        edad: "",
        ciudad: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [merchantId, setMerchantId] = useState(null);
    const [copyState, setCopyState] = useState(false);

    const handleChange = (event, field) => {
        setMerchantData(prev => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

            const payload = {
                nombre: merchantData.nombre,
                email: merchantData.email,
                password: merchantData.password,
                edad: parseInt(merchantData.edad),
                ciudad: merchantData.ciudad
            };

            const response = await axios.post(
                "http://localhost:3002/api/user/register-merchant",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const createdMerchantId = response.data.user._id;
            setMerchantId(createdMerchantId);
            setSuccess(true);
            setMerchantData({
                nombre: "",
                email: "",
                password: "",
                edad: "",
                ciudad: ""
            });
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Hubo un error al crear el merchant. Por favor, intenta nuevamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (merchantId) {
            navigator.clipboard.writeText(merchantId).then(
                () => setCopyState(true),
                (err) => console.error("Async: Could not copy text: ", err)
            );
        }
    };

    useEffect(() => {
        if (copyState) {
            const timer = setTimeout(() => setCopyState(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [copyState]);

    return (
        <div>
            <NavBar />
            {/* Similar al código original, sin react-router-dom */}
            {/* ... */}
            <Dialog.Root open={success} onOpenChange={(open) => { if (!open) setSuccess(false); }}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
                    <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4">
                        {/* Contenido Dialog */}
                        {/* ... */}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}
