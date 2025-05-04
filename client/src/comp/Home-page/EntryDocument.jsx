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

// רישום פונט בעברית
try {
    Font.register({
        family: 'Rubik',
        src: '/fonts/Rubik-Regular.ttf',
    });
} catch (error) {
    console.error('❌ שגיאה ברישום הפונט:', error);
}

// עיצוב
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 30,
        fontFamily: 'Rubik',
        direction: 'rtl',
    },
    logo: {
        width: 120,
        height: 60,
        marginBottom: 20,
        alignSelf: 'center',
    },
    text: {
        fontSize: 14,
        marginBottom: 12,
        textAlign: 'right',
    },
});

const MyDocument = ({ building }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View>

                    <Text style={styles.text}>
                        שלום דיירים יקרים בבניין בכתובת {building?.address || '[לא צוינה כתובת]'}.
                    </Text>
                    <Text style={styles.text}>
                        מהיום אנו עוברים לניהול ועד הבית ע"י מערכת 
                    </Text>
                    <Image
                        style={{ width: 150,alignSelf:'center'}}
                        src="/logo.png"
                    />
                    <Text style={styles.text}>
                        יש להיכנס ולהירשם לבניין.
                    </Text>
                    <Text style={styles.text}>
                        הסיסמה של הבניין שלנו: {building?.password || '[לא צוינה סיסמה]'}
                    </Text>
                    <Text style={styles.text}>
                        בהצלחה לכולנו!
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
                return loading ? '📦 יוצר קובץ...' : '⬇️ הורד מכתב לדיירים';
            }}
        </PDFDownloadLink>
    );
};

export default PdfFormGenerator;
