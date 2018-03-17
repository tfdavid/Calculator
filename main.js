$(document).ready(initializeApp);
function initializeApp(){
    $('.MainButtonsContainer .add').on("click", addPressed);
    $('.MainButtonsContainer .number').on("click", numberPressed);
    $('.MainButtonsContainer .equal').on("click", equalPressed);
    $('.MainButtonsContainer .subtract').on("click", subtractPressed);
    $('.MainButtonsContainer .divide').on("click", dividePressed);
    $('.MainButtonsContainer .multiply').on("click", multiplyPressed);
    $('.MainButtonsContainer .decimal').on("click", decimalPressed);
    $('.ClearButtonsContainer .Clear').on("click", clearPressed);
    $('.ClearButtonsContainer .ClearEntry').on("click", clearEntryPressed);

}

var inputArray = [];
var lastTwoItemsArray=[];
var currentValue;



function CalculatorEntry(type, value){
    this.type = type;
    this.value = value;
}

function displayOngoingOutput(){
    var display = '';
    for(var i =0; i<inputArray.length;i++){
        display += inputArray[i].value + " ";
    }
    $('.ChainedOutput').text(display);

}
function clearPressed(){
    inputArray=[];
    displayOngoingOutput();
    $('.Output').text("0");
}
function clearEntryPressed(){
    inputArray.pop();
    displayOngoingOutput();
    $('.Output').text("0");

}

function numberPressed() {
    if (inputArray.length) {
    if (inputArray[inputArray.length - 1].type === "num") {
        if(inputArray[inputArray.length - 1].value.length >8){
            return;
        }
        if(inputArray[inputArray.length - 1].value === "0"){
            inputArray.pop();
            inputArray.push(new CalculatorEntry("num", $(event.currentTarget).find("article").text()));
            displayOngoingOutput();
            return;
        }
        inputArray[inputArray.length - 1].value += $(event.currentTarget).find("article").text();
        currentValue=inputArray[inputArray.length - 1].value;
        $('.Output').text(currentValue);
        displayOngoingOutput();
        return;
        }
    }
    inputArray.push(new CalculatorEntry("num", $(event.currentTarget).find("article").text()));
    currentValue=$(event.currentTarget).find("article").text();
    $('.Output').text(currentValue);
    displayOngoingOutput();


}
function addPressed(){
    if(!inputArray.length){
        inputArray.push(new CalculatorEntry("num", "0"));
        inputArray.push(new CalculatorEntry("operator", $(event.currentTarget).find("article").text()));
        displayOngoingOutput();

    }
    if(inputArray[inputArray.length-1].type === "operator"){
        inputArray.splice(inputArray.length-1,1,new CalculatorEntry("operator", $(event.currentTarget).find("article").text()));
        displayOngoingOutput();
        if(inputArray.length===1){ //this might be buggy later, added so upon operator swap below 2 it wont trigger math
            return;
        }
        doBabyMath();
        return;
    }
    inputArray.push(new CalculatorEntry("operator", $(event.currentTarget).find("article").text()));
    displayOngoingOutput();
    doBabyMath();


}
function equalPressed(){

    if(!inputArray.length){
        $('.Output').text("There's nothing to solve here..");
        return;
    }
    if(inputArray[inputArray.length-1].type === "operator"){

        doPartialOperandMath();
        displayOngoingOutput();
        return;
    }
    if(inputArray.length === 1 && inputArray[inputArray.length-1].type === "num"){
        doMathOperationRepeat();
        displayOngoingOutput();
        return;
    }

    doMath();
    displayOngoingOutput();

}
function subtractPressed(){
    if(!inputArray.length){
        inputArray.push(new CalculatorEntry("num", "0"));
        inputArray.push(new CalculatorEntry("operator", $(event.currentTarget).find("article").text()));
        displayOngoingOutput();
    }
    if(inputArray[inputArray.length-1].type === "operator"){
        inputArray.splice(inputArray.length-1,1,new CalculatorEntry("operator", $(event.currentTarget).find("article").text()));
        displayOngoingOutput();
        if(inputArray.length===1){ //this might be buggy later, added so upon operator swap below 2 it wont trigger math
            return;
        }
        doBabyMath();
        return;
    }
    inputArray.push(new CalculatorEntry("operator", $(event.currentTarget).find("article").text()));
    displayOngoingOutput();
    doBabyMath();

}
function dividePressed(){
    if(!inputArray.length){
        inputArray.push(new CalculatorEntry("num", "0"));
        inputArray.push(new CalculatorEntry("operator", $(event.currentTarget).find("article").text()));
        displayOngoingOutput();
    }
    if(inputArray[inputArray.length-1].type === "operator"){
        inputArray.splice(inputArray.length-1,1,new CalculatorEntry("operator", $(event.currentTarget).find("article").text()));
        displayOngoingOutput();
        doBabyMath2();
        return;
    }
    // if(inputArray.length===1){
    //     inputArray.push(new CalculatorEntry("operator", $(event.currentTarget).find("article").text()));
    //     displayOngoingOutput();
    //     return;
    //
    // }
    inputArray.push(new CalculatorEntry("operator", $(event.currentTarget).find("article").text()));
    displayOngoingOutput();
    doBabyMath2();


}

function multiplyPressed(){
    if(!inputArray.length){
        inputArray.push(new CalculatorEntry("num", "0"));
        inputArray.push(new CalculatorEntry("operator", $(event.currentTarget).find("article").text()));
        displayOngoingOutput();
    }
    if(inputArray[inputArray.length-1].type === "operator"){
        inputArray.splice(inputArray.length-1,1,new CalculatorEntry("operator", $(event.currentTarget).find("article").text()));
        displayOngoingOutput();
        doBabyMath2();
        return;
    }
    inputArray.push(new CalculatorEntry("operator", $(event.currentTarget).find("article").text()));
    displayOngoingOutput();
    doBabyMath2();
}
function decimalPressed(){
    if(inputArray[inputArray.length - 1].value.length >8){  //this needs a more comprehensive fix (aesthetics)
        return;
    }
    if(!inputArray.length || inputArray[inputArray.length-1].type === "operator"){
        inputArray.push(new CalculatorEntry("num", "0."));
        displayOngoingOutput();
        $('.Output').text(inputArray[inputArray.length-1].value);
    }
    else {
        if (inputArray[inputArray.length - 1].value.indexOf(".") == -1) {
            inputArray[inputArray.length - 1].value += ".";
            $('.Output').text(inputArray[inputArray.length - 1].value);
            displayOngoingOutput();
        }
        else{return}
    }



}

function doMath(){
    var first;
    var second;
    var result;
    lastTwoItemsArray = inputArray.slice(inputArray.length-2); //Setting up to chain multiple =
    for(var i=0; i<inputArray.length; i++){
        if(inputArray[i].type === "operator") {
            first = parseFloat(inputArray[i - 1].value);
            second = parseFloat(inputArray[i + 1].value);
            if (inputArray[i].value === "\xF7") {
                result = first / second;
                result = result.toString(); //i convert this back to string here because later i will check for value with indexOf which will log an error if value becomes a number
                inputArray.splice(i - 1, 3, (new CalculatorEntry("num", result)));
                i -= 2;
                continue;
            }
            if (inputArray[i].value === "x") {
                result = first * second;
                result = result.toString();
                inputArray.splice(i - 1, 3, (new CalculatorEntry("num", result)));
                i -= 2;
                continue;
            }
        }
    }
    for(var i=0; i<inputArray.length; i++){
        if(inputArray[i].type === "operator"){
            first =parseFloat(inputArray[i-1].value);
            second = parseFloat(inputArray[i+1].value);
                if(inputArray[i].value === "+"){
                    result = first + second;
                    result = result.toString();
                    inputArray.splice(i-1,3,(new CalculatorEntry("num", result)));
                    i-=2;
                    continue;
                }
                if(inputArray[i].value === "-"){
                    result = first - second;
                    result = result.toString();
                    inputArray.splice(i-1,3,(new CalculatorEntry("num", result)));
                    i-=2;
                    continue;
                }
        }
    }





    // while(inputArray.length>2){
    //     var multiplyCheck = inputArray.some(function (object) {
    //         return elem.value === 'x' ?  true : false;
    //     });
    //     var divideCheck = inputArray.some(function (object) {
    //         return elem.value === '\xF7' ?  true : false;
    //     });
    //     if(multiplyCheck){
    //
    //     }
    //
    //
    //
    // }






    // var stringNum = inputArray[0].value.toString();         //convert back to string to fix DoMath2, but then we get a problem with .push
    var temp = inputArray.slice();

    // var temp = (new CalculatorEntry("num", stringNum));

    currentValue=inputArray[0].value;
    $('.Output').text(currentValue);
    inputArray = temp;

}
//math function to display current number when + or - is pressed
function doBabyMath(){
    var babyArray = inputArray.slice(0,inputArray.length-1);
    var first;
    var second;
    var result;
    for(var i=0; i<babyArray.length; i++){
        if(babyArray[i].type === "operator") {
            first = parseFloat(babyArray[i - 1].value);
            second = parseFloat(babyArray[i + 1].value);
            if (babyArray[i].value === "\xF7") {
                result = first / second;
                babyArray.splice(i - 1, 3, (new CalculatorEntry("num", result)));
                i -= 2;
                continue;
            }
            if (babyArray[i].value === "x") {
                result = first * second;
                babyArray.splice(i - 1, 3, (new CalculatorEntry("num", result)));
                i -= 2;
                continue;
            }
        }
    }
    for(var i=0; i<babyArray.length; i++){
        if(babyArray[i].type === "operator"){
            first =parseFloat(babyArray[i-1].value);
            second = parseFloat(babyArray[i+1].value);
            if(babyArray[i].value === "+"){
                result = first + second;
                babyArray.splice(i-1,3,(new CalculatorEntry("num", result)));
                i-=2;
                continue;
            }
            if(babyArray[i].value === "-"){
                result = first - second;
                babyArray.splice(i-1,3,(new CalculatorEntry("num", result)));
                i-=2;
                continue;
            }
        }
    }

    currentValue=babyArray[0].value;
    $('.Output').text(currentValue);
    // inputArray =[]; //added this to clear screen output


}
//math function for displaying current number when previous operators are + or -
function doBabyMath2(){
    var locator;
    //this is to find the last time a "-" or "+" appears in the array so we can update the current value to everything after that
    for(var i = inputArray.length-1; i >=0; i--){
        if(inputArray[i].value.indexOf("+") === 0 || inputArray[i].value.indexOf("-") === 0 ){
            locator = i;
            break;
        }
    }

    //might encounter a problem here later but if locator is not found babyArray will be a full copy of inputArray since i+1===0
    var babyArray = inputArray.slice(i+1,inputArray.length-1);
    if(babyArray.length < 3){
        $('.Output').text(babyArray[0].value);  //TO FIX CASE INPUT: 'x' '=';
        currentValue = babyArray[0].value;
        return;
    }
    var first;
    var second;
    var result;
    for(var i=0; i<babyArray.length; i++){
        if(babyArray[i].type === "operator") {
            first = parseFloat(babyArray[i - 1].value);
            second = parseFloat(babyArray[i + 1].value);
            if (babyArray[i].value === "\xF7") {
                result = first / second;
                babyArray.splice(i - 1, 3, (new CalculatorEntry("num", result)));
                i -= 2;
                continue;
            }
            if (babyArray[i].value === "x") {
                result = first * second;
                babyArray.splice(i - 1, 3, (new CalculatorEntry("num", result)));
                i -= 2;
                continue;
            }
        }
    }
    for(var i=0; i<babyArray.length; i++){
        if(babyArray[i].type === "operator"){
            first =parseFloat(babyArray[i-1].value);
            second = parseFloat(babyArray[i+1].value);
            if(babyArray[i].value === "+"){
                result = first + second;
                babyArray.splice(i-1,3,(new CalculatorEntry("num", result)));
                i-=2;
                continue;
            }
            if(babyArray[i].value === "-"){
                result = first - second;
                babyArray.splice(i-1,3,(new CalculatorEntry("num", result)));
                i-=2;
                continue;
            }
        }
    }

    currentValue=babyArray[0].value;
    $('.Output').text(currentValue);
    // inputArray =[]; //added this to clear screen output

}
function doMathOperationRepeat(){
    //ADDED   result = result.toString(); to fix future indexof errors

    var lastThreeItemsArray = lastTwoItemsArray.slice();
    lastThreeItemsArray.unshift(inputArray[0]);
    var first;
    var second;
    var result;
    for(var i=0; i<lastThreeItemsArray.length; i++){
        if(lastThreeItemsArray[i].type === "operator") {
            first = parseFloat(lastThreeItemsArray[i - 1].value);
            second = parseFloat(lastThreeItemsArray[i + 1].value);
            if (lastThreeItemsArray[i].value === "\xF7") {
                result = first / second;
                result = result.toString();
                lastThreeItemsArray.splice(i - 1, 3, (new CalculatorEntry("num", result)));
                i -= 2;
                continue;
            }
            if (lastThreeItemsArray[i].value === "x") {
                result = first * second;
                result = result.toString();
                lastThreeItemsArray.splice(i - 1, 3, (new CalculatorEntry("num", result)));
                i -= 2;
                continue;
            }
        }
    }
    for(var i=0; i<lastThreeItemsArray.length; i++){
        if(lastThreeItemsArray[i].type === "operator"){
            first =parseFloat(lastThreeItemsArray[i-1].value);
            second = parseFloat(lastThreeItemsArray[i+1].value);
            if(lastThreeItemsArray[i].value === "+"){
                result = first + second;
                result = result.toString();
                lastThreeItemsArray.splice(i-1,3,(new CalculatorEntry("num", result)));
                i-=2;
                continue;
            }
            if(lastThreeItemsArray[i].value === "-"){
                result = first - second;
                result = result.toString();
                lastThreeItemsArray.splice(i-1,3,(new CalculatorEntry("num", result)));
                i-=2;
                continue;
            }
        }
    }

    currentValue=lastThreeItemsArray[0].value;
    $('.Output').text(currentValue);
    var temp = lastThreeItemsArray.slice();

    inputArray = temp;
}

function doPartialOperandMath(){
    var first;
    var second;
    var result;
    var currentValToObj = new CalculatorEntry("num", currentValue);
    inputArray.push(currentValToObj);
    lastTwoItemsArray = inputArray.slice(inputArray.length-2); //Setting up to chain multiple =
    for(var i=0; i<inputArray.length; i++){
        if(inputArray[i].type === "operator") {
            first = parseFloat(inputArray[i - 1].value);
            second = parseFloat(inputArray[i + 1].value);
            if (inputArray[i].value === "\xF7") {
                result = first / second;
                result = result.toString(); //i convert this back to string here because later i will check for value with indexOf which will log an error if value becomes a number
                inputArray.splice(i - 1, 3, (new CalculatorEntry("num", result)));
                i -= 2;
                continue;
            }
            if (inputArray[i].value === "x") {
                result = first * second;
                result = result.toString();
                inputArray.splice(i - 1, 3, (new CalculatorEntry("num", result)));
                i -= 2;
                continue;
            }
        }
    }
    for(var i=0; i<inputArray.length; i++){
        if(inputArray[i].type === "operator"){
            first =parseFloat(inputArray[i-1].value);
            second = parseFloat(inputArray[i+1].value);
            if(inputArray[i].value === "+"){
                result = first + second;
                result = result.toString();
                inputArray.splice(i-1,3,(new CalculatorEntry("num", result)));
                i-=2;
                continue;
            }
            if(inputArray[i].value === "-"){
                result = first - second;
                result = result.toString();
                inputArray.splice(i-1,3,(new CalculatorEntry("num", result)));
                i-=2;
                continue;
            }
        }
    }


    // var stringNum = inputArray[0].value.toString();         //convert back to string to fix DoMath2, but then we get a problem with .push
    var temp = inputArray.slice();

    // var temp = (new CalculatorEntry("num", stringNum));

    currentValue=inputArray[0].value;
    $('.Output').text(currentValue);
    inputArray = temp;

}
