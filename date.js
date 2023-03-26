
module.exports.getDate=function(){
//instead of module.exports u can use exports directly
const today=new Date();
    const options={
        weekday:"long",
        day:"numeric",
        month:"long"
    } ;
    return today.toLocaleDateString("en-US",options);
}

exports.getDay=function (){

    const today=new Date();
        const options={
            weekday:"long"
        } ;
        return today.toLocaleDateString("en-US",options);
    }