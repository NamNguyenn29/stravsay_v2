'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { paymentServices } from '@/services/paymentService';
import { Spin, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

type PaymentStatus = 'loading' | 'success' | 'failed';

export default function PaymentCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const processedRef = useRef(false);

    const [status, setStatus] = useState<PaymentStatus>('loading');
    const [message, setMessage] = useState<string>('');
    const [paymentId, setPaymentId] = useState<string>('');
    const [errorCode, setErrorCode] = useState<string>('');

    useEffect(() => {
        // Prevent double execution in React Strict Mode
        if (processedRef.current) return;
        processedRef.current = true;

        let isSubscribed = true;

        const handleCallback = async () => {
            console.log('🚀 START handleCallback');

            try {
                // Lấy parameters từ URL
                const momoResultCode = searchParams.get('resultCode');
                const momoOrderId = searchParams.get('orderId');
                const vnpayResultCode = searchParams.get('vnp_ResponseCode');
                const vnpayTxnRef = searchParams.get('vnp_TxnRef');

                console.log('📋 MoMo resultCode:', momoResultCode);
                console.log('📋 MoMo orderId:', momoOrderId);

                // Xác định Payment ID
                const extractedPaymentId = vnpayTxnRef || momoOrderId;

                if (!extractedPaymentId) {
                    console.error('❌ Không tìm thấy Payment ID');
                    if (isSubscribed) {
                        setStatus('failed');
                        setMessage('Không tìm thấy thông tin thanh toán');
                    }
                    return;
                }

                console.log('💰 Payment ID:', extractedPaymentId);
                if (isSubscribed) setPaymentId(extractedPaymentId);

                // Kiểm tra MoMo failed
                if (momoResultCode && momoResultCode !== '0') {
                    console.log('❌ MoMo payment FAILED, code:', momoResultCode);

                    if (isSubscribed) {
                        setErrorCode(momoResultCode);
                        setMessage('Bạn đã hủy thanh toán');
                    }

                    // Gọi API cancel
                    try {
                        console.log('🔄 Calling cancelPayment API...');
                        const cancelResult = await paymentServices.cancelPayment(extractedPaymentId);
                        console.log('✅ Cancel API success:', cancelResult);
                    } catch (error) {
                        console.error('⚠️ Cancel API error:', error);
                    }

                    if (isSubscribed) {
                        setStatus('failed');
                        console.log('⏱️ Waiting 3 seconds before redirect...');

                        setTimeout(() => {
                            console.log('🚀 REDIRECTING NOW to /user/userbooking');
                            router.push('/user/userbooking');
                        }, 3000);
                    }

                    return;
                }

                // Kiểm tra VNPay failed
                if (vnpayResultCode && vnpayResultCode !== '00') {
                    console.log('❌ VNPay payment FAILED, code:', vnpayResultCode);

                    if (isSubscribed) {
                        setErrorCode(vnpayResultCode);
                        setMessage('Bạn đã hủy thanh toán');
                    }

                    try {
                        console.log('🔄 Calling cancelPayment API...');
                        await paymentServices.cancelPayment(extractedPaymentId);
                        console.log('✅ Cancel API success');
                    } catch (error) {
                        console.error('⚠️ Cancel API error:', error);
                    }

                    if (isSubscribed) {
                        setStatus('failed');
                        console.log('⏱️ Waiting 3 seconds before redirect...');

                        setTimeout(() => {
                            console.log('🚀 REDIRECTING NOW to /user/userbooking');
                            router.push('/user/userbooking');
                        }, 3000);
                    }

                    return;
                }

                // Payment success - check backend status
                console.log('🔄 Querying backend for payment status...');
                const response = await paymentServices.getPaymentById(extractedPaymentId);
                const payment = response.data.object;
                console.log('📦 Backend payment data:', payment);

                if (!payment) {
                    console.error('❌ Payment not found in backend');
                    if (isSubscribed) {
                        setStatus('failed');
                        setMessage('Không tìm thấy thông tin thanh toán');
                    }
                    return;
                }

                if (payment.status === 1) {
                    console.log('✅ Payment SUCCESS');
                    if (isSubscribed) {
                        setStatus('success');
                        setMessage('Thanh toán thành công! Đặt phòng của bạn đã được xác nhận.');

                        setTimeout(() => {
                            console.log('🚀 REDIRECTING to /user/userbooking');
                            router.push('/user/userbooking');
                        }, 2000);
                    }
                } else {
                    console.log('❌ Payment status:', payment.status);
                    if (isSubscribed) {
                        setStatus('failed');
                        setMessage('Thanh toán thất bại');
                    }
                }

            } catch (error) {
                console.error('💥 ERROR in handleCallback:', error);
                if (isSubscribed) {
                    setStatus('failed');
                    setMessage('Có lỗi xảy ra');
                }
            }
        };

        handleCallback();

        return () => {
            isSubscribed = false;
        };
    }, []);

    // LOADING
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-rose-100">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
                    <Spin size="large" />
                    <p className="mt-4 text-gray-600 font-medium">Đang xác minh thanh toán...</p>
                </div>
            </div>
        );
    }

    // SUCCESS
    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-rose-100 p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <div className="text-6xl text-green-500 mb-6 animate-bounce">
                        <CheckCircleOutlined />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">
                        Thanh toán thành công! 🎉
                    </h1>
                    <p className="text-gray-600 mb-4">{message}</p>
                    <p className="text-sm text-gray-500 mb-6">
                        Tự động chuyển trang sau 2 giây...
                    </p>
                    {paymentId && (
                        <p className="text-xs text-gray-400 mb-6">Mã thanh toán: {paymentId}</p>
                    )}
                    <Button
                        type="primary"
                        size="large"
                        className="w-full bg-green-500 hover:bg-green-600 h-12 text-lg font-semibold rounded-xl"
                        onClick={() => router.push('/user/userbooking')}
                    >
                        Xem đặt phòng của tôi
                    </Button>
                </div>
            </div>
        );
    }

    // FAILED
    if (status === 'failed') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-rose-100 p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <div className="text-6xl text-red-500 mb-6">
                        <CloseCircleOutlined />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">
                        Thanh toán thất bại
                    </h1>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-700 font-medium">{message}</p>
                        {errorCode && (
                            <p className="text-xs text-red-500 mt-2">Mã lỗi: {errorCode}</p>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mb-6">
                        Tự động chuyển trang sau 3 giây...
                    </p>
                    {paymentId && (
                        <p className="text-xs text-gray-400 mb-6">Mã thanh toán: {paymentId}</p>
                    )}
                    <div className="space-y-3">
                        <Button
                            type="primary"
                            size="large"
                            className="w-full bg-rose-500 hover:bg-rose-600 h-12 text-lg font-semibold rounded-xl"
                            onClick={() => router.push('/user/userbooking')}
                        >
                            Xem đặt phòng của tôi
                        </Button>
                        <Button
                            size="large"
                            className="w-full h-12 text-lg font-semibold rounded-xl"
                            onClick={() => router.push('/booking')}
                        >
                            Đặt phòng lại
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}