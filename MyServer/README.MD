Erik Vallis, evallis3867@conestogac.on.ca git username is HoolAgain

Repo Link
https://github.com/HoolAgain/PROG3175Assign3.git

Postman Input and Outputs

GetAllTimesOfDay
https://prog-3175-assign3.vercel.app/api/GetAllTimesOfDay

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
https://prog-3175-assign3.vercel.app/api/GetSupportedLanguages

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
https://prog-3175-assign3.vercel.app/Greet

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