"use client";

import React, { useState } from "react";
import { Input, Button, notification } from "antd";
import { motion } from "framer-motion";
import { CheckCircleOutlined, CloseCircleOutlined, TagOutlined } from "@ant-design/icons";
import { discountService } from "@/services/discountService";
import { AxiosError } from "axios";

interface DiscountInputProps {
  subtotal: number;
  onDiscountApplied: (amount: number, code: string) => void;
}

interface ErrorResponse {
  message?: string;
}

interface DiscountValidationResponse {
  isSuccess: boolean;
  message?: string;
  int?: number;
  code?: string;
}

type DiscountStatus = "idle" | "valid" | "invalid";

export default function DiscountInput({ subtotal, onDiscountApplied }: DiscountInputProps) {
  const [api, contextHolder] = notification.useNotification();
  const [discountCode, setDiscountCode] = useState<string>("");
  const [checkingDiscount, setCheckingDiscount] = useState<boolean>(false);
  const [discountStatus, setDiscountStatus] = useState<DiscountStatus>("idle");
  const [discountMessage, setDiscountMessage] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const handleCheckDiscount = async (): Promise<void> => {
    if (!discountCode.trim()) {
      api.error({
        message: "Error",
        description: "Please enter a discount code",
        placement: "topRight",
      });
      return;
    }

    try {
      setCheckingDiscount(true);
      setDiscountStatus("idle");

      const res = await discountService.validateDiscount({
        discountCode: discountCode.trim().toUpperCase(),
        minOrderAmount: subtotal
      });

      const data: DiscountValidationResponse = res.data;

      if (data.isSuccess) {
        const savedAmount = data.int || 0;
        setDiscountStatus("valid");
        setDiscountMessage(data.message || "Discount applied successfully!");
        setDiscountAmount(savedAmount);
        onDiscountApplied(savedAmount, discountCode.trim().toUpperCase());
        
        api.success({
          message: "Discount Applied!",
          description: data.message || `You saved ${savedAmount.toLocaleString()}₫`,
          placement: "topRight",
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        });
      } else {
        setDiscountStatus("invalid");
        setDiscountMessage(data.message || "Invalid discount code");
        setDiscountAmount(0);
        onDiscountApplied(0, "");
        
        api.error({
          message: "Invalid Discount",
          description: data.message || "This discount code is not valid",
          placement: "topRight",
          icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
        });
      }
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      setDiscountStatus("invalid");
      const errorMsg = err.response?.data?.message || "Failed to validate discount code";
      setDiscountMessage(errorMsg);
      setDiscountAmount(0);
      onDiscountApplied(0, "");
      
      api.error({
        message: "Error",
        description: errorMsg,
        placement: "topRight",
      });
    } finally {
      setCheckingDiscount(false);
    }
  };

  const handleRemoveDiscount = (): void => {
    setDiscountCode("");
    setDiscountStatus("idle");
    setDiscountMessage("");
    setDiscountAmount(0);
    onDiscountApplied(0, "");
    
    api.info({
      message: "Discount Removed",
      description: "Discount code has been removed",
      placement: "topRight",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDiscountCode(e.target.value.toUpperCase());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && discountStatus !== "valid") {
      handleCheckDiscount();
    }
  };

  return (
    <>
      {contextHolder}
      <div className="space-y-4">
        <label className="block text-gray-600 font-medium mb-1">
          <TagOutlined className="mr-2" />
          Discount Code (Optional)
        </label>
        
        <div className="flex gap-2">
          <Input
            value={discountCode}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter discount code"
            size="large"
            disabled={discountStatus === "valid"}
            maxLength={20}
            className={`flex-1 ${
              discountStatus === "valid" ? "border-green-400 bg-green-50" : 
              discountStatus === "invalid" ? "border-red-400" : ""
            }`}
          />
          
          {discountStatus === "valid" ? (
            <Button
              size="large"
              danger
              onClick={handleRemoveDiscount}
              className="px-6"
            >
              Remove
            </Button>
          ) : (
            <Button
              size="large"
              type="primary"
              onClick={handleCheckDiscount}
              loading={checkingDiscount}
              disabled={!discountCode.trim()}
              className="bg-rose-500 hover:bg-rose-600 px-6"
            >
              Apply
            </Button>
          )}
        </div>

        {discountStatus === "valid" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg p-3"
          >
            <CheckCircleOutlined className="text-xl" />
            <div>
              <div className="font-medium">{discountMessage}</div>
              <div className="text-sm">
                You saved: {discountAmount.toLocaleString()}₫
              </div>
            </div>
          </motion.div>
        )}

        {discountStatus === "invalid" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3"
          >
            <CloseCircleOutlined className="text-xl" />
            <div className="font-medium">{discountMessage}</div>
          </motion.div>
        )}
      </div>
    </>
  );
}