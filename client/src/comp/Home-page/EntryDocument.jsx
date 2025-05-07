import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    Image,
    PDFDownloadLink,
} from '@react-pdf/renderer';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';

// רישום פונט בעברית
try {
    Font.register({
        family: 'Rubik',
        src: '/fonts/Rubik-Regular.ttf',
    });
} catch (error) {
    console.error('❌ שגיאה ברישום הפונט:', error);
}

// עיצוב מעודכן
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 30,
        fontFamily: 'Rubik',
        direction: 'rtl',
        backgroundColor: '#f3f4f6',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D1BB9B',
        marginBottom: 15,
        textAlign: 'center',
    },
    text: {
        fontSize: 14,
        marginBottom: 12,
        textAlign: 'center',
        // color: '#333',
        lineHeight: 1.5,
    },
    highlight: {
        fontWeight: 'bold',
        // color: '#D1BB9B',
    },
    password: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#D1BB9B',
        textAlign: 'center',
        marginBottom: 12,
    },
    logo: {
        width: 150,
        marginVertical: 20,
        alignSelf: 'center',
    },
});

const MyDocument = ({ building }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.card}>
                    <Text style={styles.title}>ברוכים הבאים למערכת החדשה!</Text>
                    <Text style={styles.text}>
                        שלום דיירים יקרים בבניין בכתובת{' '}
                        <Text style={styles.highlight}>{building?.address || '[לא צוינה כתובת]'}</Text>.
                    </Text>
                    <Text style={styles.text}>
                        מהיום אנו עוברים לניהול ועד הבית ע״י מערכת חדשנית שתשפר את איכות החיים שלכם.
                    </Text>
                    <Image
                        style={styles.logo}
                        src="/logo.png"
                    />
                    <Text style={styles.text}>
                        אנא הירשמו למערכת באמצעות הסיסמה הייחודית לבניין שלכם.
                    </Text>
                    <Text style={styles.password}>
                        סיסמת הבניין: {building?.password || '[לא צוינה סיסמה]'}
                    </Text>
                    <Text style={styles.text}>
                        אנו מאחלים לכולנו הצלחה ומעבר חלק למערכת החדשה. תודה על שיתוף הפעולה!
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

const PdfFormGenerator = () => {
    const building = useSelector((store) => store.buildingDetails.building);

    return (
        <PDFDownloadLink
            document={<MyDocument building={building} />}
            fileName="homecontrol-welcome.pdf"
        >
            {({ loading, error }) => {
                if (error) {
                    console.error('❌ שגיאה בהפקת PDF:', error);
                    return 'שגיאה ביצירת PDF';
                }
                return (
                    <div style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                        <Button
                            style={{
                                backgroundColor: '#4CAF50',
                                color: '#fff',
                                padding: '10px 20px',
                                fontSize: '16px',
                                borderRadius: '5px',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            {loading ? '📦 יוצר קובץ...' : '⬇️ הורד מכתב לדיירים'}
                        </Button>
                    </div>
                );
            }}
        </PDFDownloadLink>
    );
};

export default PdfFormGenerator;