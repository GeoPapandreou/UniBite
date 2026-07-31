class ControllerHelpers {

    /**
     ** Formats the query from parameters 
     */
    static FormatQueryFromParams(query, queryParams, orderBy = null)
    {
        // Gets the entries from the query parameters
        let entries = Object.entries(queryParams)
        let length = entries.length;
        // If there are any entries...
        if(length > 0)
        {
            if(query.includes("WHERE"))
                query +=" AND "
            else
                // Adds the where statement
                query += ` WHERE `
                
            // Sets as the current index 0
            let index = 0;
           
            // For each key value pair in the JSON object...
            for (const [key, value] of entries) 
            {
                // Gets the values
                let values = [];
                // If the value is an array...
                if(Array.isArray(value)) 
                {
                    // For each value in the array...
                    value.forEach(x => 
                    {
                        // Add the value to the array
                        values.push(x); 
                        // Increments the length by one
                        length++;
                    });
                    // Decreases the length by one
                    length--;
                }
                // Else...
                else
                    // Adds the value to the array
                    values.push(value);
                // For each value in the array...
                values.forEach(x => 
                {
                    // Adds the key name to the string
                    query += `${key} `

                    // Splits the value at '.' 
                    let valueArray = x.split(".");

                    // If the value array's length i greater than 1...
                    if(valueArray.length > 1)
                    {
                        // If it is less than...
                        if(valueArray[0] === "lt")
                            query += "<= ";
                        // Else if it is greater than
                        else if(valueArray[0] === "gt")
                            query += ">= ";
                        // If the value is not a number...
                        if(isNaN(valueArray[1]))
                            query += `\"${valueArray[1]}\" `
                        // Else...
                        else
                            query += `${valueArray[1] }`
                    }
                    // Else...
                    else
                    {
                        if(isNaN(x))
                            query += `= \"${x}\" `
                        else
                            query += `= ${x}`
                    }

                    if(index < length - 1)
                        query +=" AND ";
                    index++;
                });
            }
        }
        // If the order by is null...
        if(orderBy !== null)
            query += `  ORDER BY ${orderBy}`

        query += ";";
        // Returns the query
        return query;
    }

    /**
     ** Formats the values for the bulk insert 
     * @param {List} values 
     */
    static FormatValuesForBulkInsert(values) 
    {
        var finalString = "";
        values.forEach(value => {
            finalString += ` (${value})`;

            if(values.length - 1 != values.indexOf(value))
                finalString += ","
        });

        return finalString;
    }

    /**
     ** Gets the current date as a string
     * @returns Returns the current date as a string
     */
    static GetCurrentDate()
    {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        let dateToString = `${year}-${month}-${day}`;

        return dateToString;
    }

    /**
     ** Gets the current date time and formats it as a string
     * @returns The date as a string
     */
    static GetCurrentDateTime()
    {
        let date = new Date();

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
     ** Gets the current date time and formats it as a string
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
     ** Checks if a string is null or empty  
     * @param {string} string The string
     * @returns TRUE if null or empty 
     */
    static IsNullOrEmpty(string)
    {
        // If the string is empty...
        if(string === "")
            // Return true
            return true;
        
        // Return false
        return false;
    }

    /**
     ** Get random date
     */
    static RandomDate(start, end) 
    {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
}

module.exports = ControllerHelpers;