Erik Vallis, evallis3867@conestogac.on.ca git username is HoolAgain

Repo Link
https://github.com/HoolAgain/PROG3175Assign3.git

Postman Input and Outputs

GetAllTimesOfDay
http://localhost:8080/api/GetAllTimesOfDay

{
    "message": "success",
    "data": [
        {
            "timeOfDay": "Morning"
        },
        {
            "timeOfDay": "Afternoon"
        },
        {
            "timeOfDay": "Evening"
        }
    ]
} 

GetSupportedLanguages
http://localhost:8080/api/GetSupportedLanguages

{
    "message": "success",
    "data": [
        {
            "language": "English"
        },
        {
            "language": "French"
        },
        {
            "language": "Spanish"
        }
    ]
}

Greet
http://localhost:8080/Greet

RequestBody:
{
    "timeOfDay": "Morning",
    "language": "English",
    "tone": "Formal"
}
ResponseBody:
{
    "greetingMessage": "Good morning!"
}