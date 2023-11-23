import {makeStyles} from "@mui/styles";
import {Branding} from "../../branding";
import cpdLogo from "../../assets/Logos/cpdLogo.png";

export const loginStyles = makeStyles((theme) => ({
	gridLogo: {
		paddingBottom: theme.spacing(3),
	},
	grid: {
		justifyContent: 'center',
	},
	box: {
		width: '90%',
		maxWidth: 650,
	},
	card: {
		justifyContent: 'center',
	},
	cardMedia: {
		width: 200,
		height: 200,
		backgroundSize: 'contain',
	},
	cardHeader: {
		paddingBottom: 0
	},
	cardContent: {
		justifyContent: 'center',
		textAlign: 'center',
		"&:last-child": {
			paddingBottom: theme.spacing(1)
		}
	},
	boxExpandIdp: {
		textAlign: 'center',
	},
	chipExpand: {
		backgroundColor: Branding.secondary,
		color: Branding.white,
		'&:hover': {
			backgroundColor: Branding.secondary,
			opacity: Branding.opacityHover,
		},
	},
	expandIcon: {
		color: Branding.white,
	},
	divider: {
		marginBottom: theme.spacing(2)
	},
	typoToS: {
		paddingTop: theme.spacing(3),

	},
	linkTos: {
		fontSize: 14,
		'&:hover': {
			color: Branding.accent,
			opacity: Branding.opacityHover,
		},
	},
	midBul: {
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),
		color: Branding.secondary,
	},
	linkImprint: {
		fontSize: 14,
		'&:hover': {
			cursor: 'pointer',
			color: Branding.accent,
			opacity: Branding.opacityHover,
		},
	},
	logoGrid: {
		backgroundImage: `url(${cpdLogo})`,
		height: '50vh',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'bottom',
		backgroundSize: '100% 92vh'
	},
	contentGrid: {
		height: '50vh',
		// padding: '30px'
	},
	rightPanel: {
		// background: '#0F295E',
		display: 'flex',
		// padding: '0px 10rem',
		justifyContent: 'space-between',
	},
	spacing: {
		// padding: '0px 10rem',
		// alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
		margin: '0 auto'
	},
	adminText: {
		fontFamily: 'Montserrat !important',
		fontSize: '14px',
		lineHeight: '17px',
		float: 'right'
	},
	heading: {
		fontFamily: 'Montserrat !important',
		fontSize: '40px',
		lineHeight: '44px',
		color: "#0f2b5c",
		fontWeight: '700'
	},
	welcomeText: {
		fontFamily: 'Montserrat !important',
		fontSize: '30px',
		lineHeight: '38px',
		color: "#FFF",
		fontWeight: '600'
	},
	welcomeSubText: {
		fontFamily: 'Montserrat !important',
		fontSize: '16px',
		lineHeight: '22px',
		color: "#FFF",
		fontWeight: '400'
	},
	subHeading: {
		color: '#7098e2'
	},
	upperCircle: {
		height: '50px',
		width: '50px',
		borderRadius: '50px',
		background: '#7096E5'
	},
	lowerCircle: {
		height: '25px',
		width: '25px',
		borderRadius: '50px',
		background: '#71E2CB',
		margin: '0 auto',
		display: 'flex',
		alignItems: 'center'
	},
	lowerCircleContainer: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center'
	},
	continueBtn: {
		background: '#7096E5 !important',
		borderRadius: '6px !important',
		height: '60px',
		color: '#FFF',
		fontFamily: 'Montserrat !important',
		fontSize: '16px',
		lineHeight: '22px',
		fontWeight: '500',
		textTransform: 'none'
	},
	btnMargin: {
		marginTop: '20px'
	},
	resendText: {
		fontFamily: 'Montserrat !important',
		fontSize: '16px',
		lineHeight: '22px',
		color: "#FFF",
		fontWeight: '400',
		marginTop: '10px'
	},
	resetOtpText: {
		color: "#008DFA",
		textDecoration: 'underline',
		cursor: 'pointer'
	},
	label: {
		fontFamily: 'Montserrat !important',
		fontSize: '16px',
		lineHeight: '22px',
		color: "#FFF",
		fontWeight: '400',
		marginBottom: '5px'
	},
	OtpMargin: {
		margin: '35px 0px'
	},
	btnSpacing: {
		marginTop: '100px'
	},
	textWidth: {
		width: '484px'
	},
	infoIcon: {
		color: '#FFF',
		marginLeft: '5px',
		cursor: 'pointer',
		fontSize: '18px'
	},
	contentPadding: {
		padding: '30px'
	},
	headingPadding: {
		padding: '0px 16%'
	},
	headingPanel: {
		width: '100%',
		marginTop: '40px'
	},
	displayBaseLine: {
		display: 'flex',
		alignItems: 'baseline'
	}
}));
