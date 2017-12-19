$(document).ready(initializeApp);
function initializeApp(){
    $('.MainButtonsContainer div').on("click", getValue);
    $('.ClearButtonsContainer div').on("click",getValue);
}


function getValue() {
    var val = $(this).text();
    switch (val) {
        case 'C':
            my_calculator.ClearAll();
            break;
        case '+':
            my_calculator.add(val);
            break;
    }
}
