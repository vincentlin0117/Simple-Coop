// 1. Email
// 2. Password
// 3. First Name
// 4. Last Name
// 5. Street Address 1
// 6. Street Address 2
// 7. City
// 8. State
// 9. ZIP
// 10. Phone
// 11. Coop Registration ID

// Will validate form data, and return an error string
const validateRegistration = ()=>{
    // HTML Values
    const strEmail = $('#txtRegisterEmail').val();
    const strPassword = $('#txtRegisterPassword').val();
    const strFirstName = $('#txtRegisterFirstName').val();
    const strLastName = $('#txtRegisterLastName').val();
    const strAddressOne = $('#txtRegisterStreetAddress1').val();
    const strAddressTwo = $('#txtRegisterStreetAddress2').val();
    const strCity = $('#txtRegisterCity').val();
    const strState = $('#txtRegisterState').val();
    const strZip = $('#txtRegisterZIP').val();
    const strPhone = $('#txtRegisterPhone').val();
    const strCoopId = $('#txtRegisterCoopID').val();

    // Return value
    let resultStr = '';

    // REGEX      
    const emailRegEx = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

    // https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s14.html
    const zipCodeRegEx = new RegExp("^[0-9]{5}(?:-[0-9]{4})?$");

    // https://ihateregex.io/expr/phone/
    const phoneRegEx = new RegExp("^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$");

    //////////////////////////
    // CHECKS
    //////////////////////////

    if(!emailRegEx.test(strEmail)) resultStr += '<p>Invalid Email</p>';    
    if(strPassword.length < 8) resultStr += '<p>Invalid Password. Must be at least 8 characters.</p>'; 

    if(strFirstName.length < 1) resultStr += '<p>First Name must have a at least one character.</p>';
    if(strLastName.length < 1) resultStr += '<p>Last Name must have at least one character.</p>';
    if(strAddressOne.length < 1) resultStr += '<p>Address needs to be filled out.</p>';
    if(strCity.length < 1) resultStr += '<p>City needs to be filled out.</p>';
    if(strState.length < 1) resultStr += '<p>State needs to be chosen.</p>';

    if(!zipCodeRegEx.test(strZip)) resultStr += '<p>Invalid Zip Code</p>';
    if(!phoneRegEx.test(strPhone)) resultStr += '<p>Invalid telephone number.</p>';

    if(strCoopId.length < 1) resultStr+='<p>Invalid CoopID. If you do not have a CoopID, click generate CoopID<p>';

    // If error was found, print sweet alert
    if(resultStr){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            html: resultStr
        });
    };

    // Return error str
    return resultStr;

}

const validateLogin = ()=>{
    const strLoginUsername = $('#txtLoginUserName').val();
    const strLoginPassword = $('#txtLoginPassword').val();

    let resultStr = '';

    const emailRegEx = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

    if(!emailRegEx.test(strLoginUsername)) resultStr += '<p>Email is invalid.</p>';
    if(strLoginPassword.length < 8) resultStr += '<p>Invalid Password. Must be at least 8 characters.</p>';

    // If error was found, print sweet alert
    if(resultStr){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            html: resultStr
        });
    };

    return resultStr;
};