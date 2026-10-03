// Public Firebase web configuration. Database rules control access.
(() => {
    if (typeof firebase === 'undefined') return;
    const app = firebase.initializeApp({
        apiKey: 'AIzaSyD-co-ckR2TFKZBxw2DEzs3Yo3VjVxLBnQ',
        authDomain: 'digital-card-moody.firebaseapp.com',
        databaseURL: 'https://digital-card-moody-default-rtdb.asia-southeast1.firebasedatabase.app',
        projectId: 'digital-card-moody',
        storageBucket: 'digital-card-moody.firebasestorage.app',
        messagingSenderId: '983200494854',
        appId: '1:983200494854:web:5e91ad00c98f611f2c1a87'
    });
    if (!app.options.databaseURL) {
        window.moodyRSVP = {
            async submit() { throw new Error('RSVP setup is in progress. Please try again later.'); },
            listen(onData) { onData([]); }
        };
        return;
    }
    const db = app.database();
    const entries = db.ref('rsvps');
    function friendlyError(error) {
        if (/permission/i.test(error.code || error.message)) {
            return new Error('RSVP is unavailable. Please contact the hosts or try again later.');
        }
        return new Error('Unable to send your RSVP. Please check your connection and try again.');
    }
    async function waitForConnection() {
        const connection = db.ref('.info/connected');
        await new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                connection.off('value', listener);
                reject(new Error('Unable to connect. Please check your connection and try again.'));
            }, 10000);
            function listener(snapshot) {
                if (!snapshot.val()) return;
                clearTimeout(timer);
                connection.off('value', listener);
                resolve();
            }
            connection.on('value', listener);
        });
    }
    window.moodyRSVP = {
        async submit(form) {
            const data = {
                nama: form.nama.trim(),
                kehadiran: form.kehadiran,
                jumlah: form.kehadiran === 'Attending' ? Number(form.jumlah) : 0,
                ucapan: form.ucapan.trim(),
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };
            if (!data.nama || data.nama.length > 100) throw new Error('Please enter a name of 1–100 characters.');
            if (!['Attending', 'Not Attending'].includes(data.kehadiran)) throw new Error('Please select your attendance status.');
            if (data.kehadiran === 'Attending' && ![1, 2].includes(data.jumlah)) throw new Error('Please select the number of guests.');
            if (data.ucapan.length > 1000) throw new Error('Please keep your wishes within 1,000 characters.');
            await waitForConnection();
            try {
                await entries.push(data);
            } catch (error) {
                console.error('Firebase RSVP write failed:', error.code);
                throw friendlyError(error);
            }
        },
        listen(onData, onError) {
            entries.orderByChild('timestamp').on('value', snapshot => {
                const items = [];
                snapshot.forEach(child => { items.push({ id: child.key, ...child.val() }); });
                onData(items);
            }, error => {
                console.error('Firebase guestbook read failed:', error.code);
                onError(error);
            });
        }
    };
})();
