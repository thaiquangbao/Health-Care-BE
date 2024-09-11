class TeachAIHearth {
    async bloodPressureMale(age, tamThu, tamTruong) {
    // Khởi tạo đối tượng kết quả với các giá trị mặc định
        let result = {
            maxPressure: null,
            minPressure: null,
            message: ''
        };
        // Xác định phạm vi huyết áp dựa trên độ tuổi
        if (age <= 19) {
            result.maxPressure = 120;
            result.minPressure = 70;
        } else if (age >= 20 && age <= 29) {
            result.maxPressure = 124;
            result.minPressure = 75;
        } else if (age >= 30 && age <= 39) {
            result.maxPressure = 126;
            result.minPressure = 79;
        } else if (age >= 40 && age <= 49) {
            result.maxPressure = 130;
            result.minPressure = 83;
        } else if (age >= 50 && age <= 59) {
            result.maxPressure = 137;
            result.minPressure = 85;
        } else if (age >= 60 && age <= 69) {
            result.maxPressure = 143;
            result.minPressure = 84;
        } else {
            result.maxPressure = 145;
            result.minPressure = 82;
        } 

        // Kiểm tra huyết áp tâm thu và tâm trương
        if (tamThu <= result.maxPressure && tamTruong >= result.minPressure) {
            result.message = "Huyết áp bình thường.";
        } else if (tamThu > result.maxPressure) {
            result.message = "Huyết áp cao.";
        } else if (tamTruong < result.minPressure) {
            result.message = "Huyết áp thấp.";
        }

        return result;
    }
    
    async bloodPressureFemale(age, tamThu, tamTruong) {
        // Khởi tạo đối tượng kết quả với các giá trị mặc định
        let result = {
            maxPressure: null,
            minPressure: null,
            message: ''
        };

        // Xác định phạm vi huyết áp dựa trên độ tuổi
        if (age <= 19) {
            result.maxPressure = 111;
            result.minPressure = 67;
        } else if (age >= 20 && age <= 29) {
            result.maxPressure = 114;
            result.minPressure = 69;
        } else if (age >= 30 && age <= 39) {
            result.maxPressure = 118;
            result.minPressure = 73;
        } else if (age >= 40 && age <= 49) {
            result.maxPressure = 126;
            result.minPressure = 78;
        } else if (age >= 50 && age <= 59) {
            result.maxPressure = 134;
            result.minPressure = 81;
        } else if (age >= 60 && age <= 69) {
            result.maxPressure = 139;
            result.minPressure = 81;
        } else {
            result.maxPressure = 146;
            result.minPressure = 79;
        }

        // Kiểm tra huyết áp tâm thu và tâm trương
        if (tamThu <= result.maxPressure && tamTruong >= result.minPressure) {
            result.message = "Huyết áp bình thường.";
        } else if (tamThu > result.maxPressure) {
            result.message = "Huyết áp cao.";
        } else if (tamTruong < result.minPressure) {
            result.message = "Huyết áp thấp.";
        }

        return result;
    
    }
    async BMI(bmi) {
        let category = "";

        if (bmi < 18.5) {
            category = "Nhẹ cân (Underweight)";
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            category = "Bình thường (Normal)";
        } else if (bmi >= 25 && bmi <= 29.9) {
            category = "Tiền béo phì (Pre-obesity)";
        } else if (bmi >= 30 && bmi <= 34.9) {
            category = "Béo phì độ I (Obesity class I)";
        } else if (bmi >= 35 && bmi <= 39.9) {
            category = "Béo phì độ II (Obesity class II)";
        } else if (bmi >= 40) {
            category = "Béo phì độ III (Obesity class III)";
        } else {
            category = "Chỉ số BMI không hợp lệ";
        }

        return category;
    }
    async heartRateMale(age, heartRate) {
        let min, max;
        
        if (age < 1) {
            min = 102;
            max = 155;
        } else if (age < 2) {
            min = 95;
            max = 137;
        } else if (age >= 2 && age < 3) {
            min = 85;
            max = 124;
        } else if (age >= 4 && age < 5) {
            min = 74;
            max = 112;
        } else if (age >= 6 && age < 8) {
            min = 66;
            max = 105;
        } else if (age >= 9 && age < 11) {
            min = 61;
            max = 97;
        } else if (age >= 12 && age < 15) {
            min = 57;
            max = 92;
        } else if (age >= 16 && age < 19) {
            min = 52;
            max = 88;
        } else if (age >= 20 && age < 39) {
            min = 52;
            max = 89;
        } else if (age >= 40 && age < 59) {
            min = 50;
            max = 91;
        } else if (age >= 60 && age < 79) {
            min = 50;
            max = 90;
        } else if (age >= 80) {
            min = 51;
            max = 94;
        } else {
            return "Tuổi không hợp lệ.";
        } 
         if (heartRate >= min && heartRate <= max) {
            return "Nhịp tim bình thường.";
        } else if (heartRate > max) {
            return "Nhịp tim đập nhanh.";
        } else {
            return "Nhịp tim đập chậm.";
        }
    }  
    async heartRateFeMale(age, heartRate) {
        let min, max;

        if (age < 1) {
            min = 104;
            max = 156;
        } else if (age < 2) {
            min = 95;
            max = 139;
        } else if (age >= 2 && age < 3) {
            min = 88;
            max = 125;
        } else if (age >= 4 && age < 5) {
            min = 76;
            max = 117;
        } else if (age >= 6 && age < 8) {
            min = 69;
            max = 106;
        } else if (age >= 9 && age < 11) {
            min = 66;
            max = 103;
        } else if (age >= 12 && age < 15) {
            min = 60;
            max = 99;
        } else if (age >= 16 && age < 19) {
            min = 57;
            max = 95;
        } else if (age >= 20 && age < 39) {
            min = 57;
            max = 95;
        } else if (age >= 40 && age < 59) {
            min = 56;
            max = 92;
        } else if (age >= 60 && age < 79) {
            min = 56;
            max = 94;
        } else if (age >= 80) {
            min = 56;
            max = 93;
        } else {
            return "Tuổi không hợp lệ.";
        }
        
        if (heartRate >= min && heartRate <= max) {
            return "Nhịp tim bình thường.";
        } else if (heartRate > max) {
            return "Nhịp tim đập nhanh.";
        } else {
            return "Nhịp tim đập chậm.";
        }
    } 
    async temperature(age,temperature) {
        let min,max;
        if(age <= 10) {
            min = 36.4;
            max = 37.7;
        } else if(age >= 11 && age <= 65) {
            min = 36.8;
            max = 37.8;
        } else if(age > 65) {
            min = 35.8;
            max = 37.1;
        } else {
            return "Nhiệt độ không hợp lệ.";
        }
         if (temperature >= min && temperature <= max) {
            return "Nhiệt độ cơ thể bình thường.";
        } else if (temperature > max) {
            return "Nhiệt độ cơ thể cao.";
        } else {
            return "Nhiệt độ cơ thể thấp.";
        }

    }
}
module.exports = new TeachAIHearth();