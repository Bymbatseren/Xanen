 const validate = (number:any,setError:any) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (number && !phoneRegex.test(number)) {
      setError("Зөв утасны дугаар оруулна уу.");
      return false;
    }
    return true;
  };
  export default validate

