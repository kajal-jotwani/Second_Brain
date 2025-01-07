export function random(len: number){
    const characters = "abcdeqwygdikjncxpokijnhbdncxm2345678901";
    let result = "";
    for(let i = 0; i < len; i++){
        result += characters.charAt(Math.floor(Math.random()*characters.length));
    }
    return result;
}