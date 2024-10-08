const form = document.querySelector('form');
const resultdiv = document.querySelector('.result');

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from auto-submitting
    getWordInfo(form.elements[0].value);
});

const getWordInfo = async (word) => {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();

        // Check if data is empty or if the word is not found
        if (!data || data.length === 0) {
            resultdiv.innerHTML = "<p>Word not found. Please try another word.</p>";
            return;
        }

        // Accessing data correctly
        const wordData = data[0]; // Assuming the first entry is what we want
        let definitions = wordData.meanings[0].definitions[0];

        // Prepare antonyms HTML
        let antonymsHTML = "";
        if (definitions.antonyms && definitions.antonyms.length > 0)  { //checks if antonyms exist
            antonymsHTML = "<ul>"; //start ul
            definitions.antonyms.forEach(antonym => {
                antonymsHTML += `<li>${antonym}</li>`; //list to store them
            }); // loop to traverse through each antonym
            antonymsHTML += "</ul>"; //close the unordered list
        } else {
            antonymsHTML = "<p>No antonyms found.</p>";
        }
       

        // Updating HTML
        resultdiv.innerHTML = `
            <h2><strong>Word: </strong>${wordData.word}</h2>
            <p><strong>Part Of Speech: </strong>${wordData.meanings[0].partOfSpeech}</p>
            <p><strong>Meaning: </strong>${definitions.definition === undefined ? "Meaning Not Found" : definitions.definition}</p>
            <p><strong>Example: </strong>${definitions.example === undefined ? "Example Not Found" : definitions.example}</p>
            <p><strong>Antonyms:</strong> ${antonymsHTML}</p>
           
        `;
//ADDING READ MORE BUTTON
         // Prepare Read More link
         let readMoreHTML = "";
         if (wordData.sourceUrls && wordData.sourceUrls.length > 0) {
             readMoreHTML = `<a href="${wordData.sourceUrls[0]}" target="_blank">Read More</a>`;
             resultdiv.innerHTML+=  readMoreHTML;
         }

        //console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        resultdiv.innerHTML = "<p>Failed to fetch data. Please try again later.</p>";
    }
};
