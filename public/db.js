const indexedDB = window.indexedDB;

let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = event => {
    const db = event.target.result;
    db.createObjectStore("pending", {autoIncrement: true})
};

request.onsuccess = event => {
    db = event.target.result;
    if(navigator.onLine){
        checkDatabase();
    }
};

request.onerror = event => {
    console.log("Error code: " + event.target.errorCode);
};

function saveRecord(record){
    const transaction = db.transaction(["pending"], readwrite);
    const store = transaction.objectStore("pending");
    store.add(record)
}

function checkDatabase(){
    const transaction = db.transaction(["pending"], readwrite);
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = () => {
        if(getAll.result.length > 0){
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result)
            }).then(res => res.json())
            .then(() => {
                const transaction = db.transaction(["pending"], readwrite);
                const store = transaction.objectStore("pending");
                store.clear();
            });
        }
    };
};



