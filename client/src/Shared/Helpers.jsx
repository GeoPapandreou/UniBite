class Helpers {

    /**
     * Converts a chosen listing photo to the data URL stored in the database
     */
    static async ReadListingPhoto(photo) {
        if(!photo) return null;

        const prefix = `data:${photo.type};base64,`;
        if(prefix.length + 4 * Math.ceil(photo.size / 3) > 65535) {
            throw new Error("The photo is too large. Please choose an image smaller than 48 KB.");
        }

        const bytes = new Uint8Array(await photo.arrayBuffer());
        return prefix + btoa(Array.from(bytes, Byte => String.fromCharCode(Byte)).join(""));
    }

    /**
     * Gets the current date time and formats it as a string
     * @returns The date as a string
     */
    static FormatDateTime(date)
    {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        let dateToString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        return dateToString;
    }

    /**
     * Gets the @date and returns the full date 
     * @param {Date} date The date
     * @returns The date time with 00:00:00 
     */
    static GetFullDate(date)
    {
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        return new Date(year, month, day);
    }

    /**
     * Gets the @data and formats it to a string
     * @param {Date} date 
     * @returns The date
     */
    static GetFullDateToString(date)
    {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        return `${year}-${month}-${day}`;
    }

    /**
     * Splits the date and time and returns them separately
     * @param {Date} date 
     * @returns A JSON oject with the date and hour
     */
    static GetDateHour(date)
    {
        let fullDate = this.GetFullDate(date);
        let hour = date.getHours();

        return {"date" : fullDate, "hour" : hour};
    }
}

export default Helpers;
