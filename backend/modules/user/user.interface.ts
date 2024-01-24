// I decided not to use Mongoose, as MongoDB driver alone is 2x faster and the app itself should be very responsive.
// Plain interface is beneficial for this kind of app.
interface User {
    username: string
    password: string
    //chatRooms?: string[] // Chatrooms
}

export default User