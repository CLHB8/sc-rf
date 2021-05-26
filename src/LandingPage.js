import React, {useState} from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import KeyboardHideIcon from "@material-ui/icons/KeyboardHide";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {isMacOs, isWindows} from "react-device-detect";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import KeyboardIcon from "@material-ui/icons/Keyboard";


const useStyles = makeStyles((theme) => ({
    searchContainer: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '14vh',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    programs: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        '& > *': {
            margin: theme.spacing(1),
            width: theme.spacing(16),
            height: theme.spacing(16),
        },
    },
    container: {
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    programAvatars: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    programContainers: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    subtitle: {
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
    searchBar: {
        width: '100vw',
        maxWidth: '650px',
        marginTop: theme.spacing(2),
        margin: theme.spacing(0.5),
    },
    programBar: {
        marginTop: theme.spacing(2),
        margin: theme.spacing(0.5),
        width: '25vw',
        maxWidth: '300px',
    },
    searchInputForm: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    search_description: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing(3),
        marginTop: theme.spacing(0.5),
    },
    search_desc_button: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(1),
    }
}));


export default function App() {

    const classes = useStyles();
    const [query, setQuery] = useState("");
    const [selectedProgram, setSelectedProgram] = useState('');
    const [tabsValue] = useState(isWindows ? 0 : (isMacOs ? 1 : 2));
    const [inputShortcut, setInputShortcut] = useState("");
    const [textSearch, setTextSearch] = useState(true);

    const history = useHistory();

    const handleSubmit = (evt) => {
        evt.preventDefault();
        // history.push('/search?os=' + tabsValue + '&program=' + selectedProgram + '&query=' + query);
        if (textSearch) {
            history.push('/search?type=' + textSearch + '&os=' + tabsValue + '&program=' + selectedProgram + '&query=' + query);
        } else {
            history.push('/search?type=' + textSearch + '&os=' + tabsValue + '&program=' + selectedProgram + '&sc-query=' + inputShortcut);
        }
    }

    const handleSearchTypeChange = () => {
        setTextSearch(!textSearch);
        setQuery("");
        setInputShortcut("");
    }

    const handleKeyDown = (evt) => {
        if (evt.key !== 'Enter') {
            if (evt.key === 'Control') {
                evt.key = 'Ctrl'
            }
            if (evt.key === 'Meta' && isWindows) {
                evt.key = 'Win'
            } else if (evt.key === 'Meta' && isMacOs) {
                evt.key = 'Command'
            }
            if (evt.key === 'Alt' && isMacOs) {
                evt.key = 'Option'
            }
            if (evt.key !== 'Backspace') {
                if (inputShortcut === '') {
                    setInputShortcut(evt.key)
                } else {
                    let newQueryValue = inputShortcut + ', ' + evt.key
                    setInputShortcut(newQueryValue)
                }
            } else {
                let newQueryValue = inputShortcut.substring(0, inputShortcut.lastIndexOf(", "));
                setInputShortcut(newQueryValue)
            }
        }
    }

    const programs_available = ['All', '1Password', '3D Coat', 'AVS Audio Editor', 'AVS Video Editor', 'Ableton Live 9', 'Access 2010', 'Access 2016', 'Ace Projects', 'Act! CRM', 'Adobe Acrobat Pro', 'Adobe After Effects CC', 'Adobe After Effects CS5', 'Adobe Animate CC', 'Adobe Audition CC', 'Adobe Captivate 2017', 'Adobe ColdFusion Builder 2.0', 'Adobe Dreamweaver', 'Adobe Fireworks MX', 'Adobe Flash Professional', 'Adobe Illustrator', 'Adobe Photoshop', 'Adobe Premiere CC', 'Adobe Reader', 'Adobe RoboHelp', 'Adobe XD (Experience Design)', 'Age of Empires', 'Alphacam', 'Altium Designer', 'Amarok', 'Amazon Kindle', 'Amazon Prime Video', 'Android Emulator', 'Android Studio', 'Anim8or', 'Anime Studio', 'Ansys Mechanical', 'Apple Calendar', 'Apple Keynote', 'Apple Mail', 'Apple Motion', 'Apple Notes', 'Apple Numbers', 'Apple Pages', 'Apple Photos', 'Apple XCode 8', 'Aptana Studio 3', 'ArchiCAD 20', 'ArtRage 4.5 5', 'Asana', 'Aspire', 'Atlasian JIRA Agile', 'Atlassian Confluence 6', 'Atlassian Crucible', 'Atlassian FishEye 4', 'Atom (text editor) 1.0', 'Audacity 2', 'AutoCAD', 'AutoCad Architecture', 'Autodesk 3ds Max', 'Autodesk Inventor', 'Autodesk Maya', 'Autodesk Mudbox', 'Autodesk Revit Architecture', 'Autodesk SketchBook Pro', 'Avid Media Composer 7', 'Axialis IconWorkshop', 'Balsamiq Mockups', 'Bash', 'Battlefield 12', 'Beyond Compare', 'Bitbucket', 'Bitcomet', 'Blender 3D', 'Brackets', 'BrainSuite', 'Brave Browser', 'BricsCAD', 'CA Client Automation', 'CINEMA 4D', 'Cabinet Vision', 'Calibre', 'Call of Duty', 'Camtasia', 'Chief Architect', 'Civilization V', 'Clarizen', 'Clementine Player', 'Clink', 'Clip Studio Paint (Manga Studio)', 'Cloud9', 'CodeLite 10', 'ComplyPro 2017B', 'Compressor', 'Comsol 5', 'Corel Designer X7', 'Corel Draw X8', 'Corel Painter 2017', 'Corel PhotoPaint X6', 'Corel Quattro Pro X8', 'Corel Ventura 10', 'Corel VideoStudio X9.5', 'Counter Strike Source', 'CrazyTalk 8', 'Cubase', 'CuteFTP', 'CyberLink PhotoDirector 8', 'Cyberduck', 'DAZ Studio', 'DaVinci Resolve 14', 'Daz 3D Bryce 7', 'Daz 3D Carrara 8', 'Desk.com', 'Directory Opus', 'Discourse', 'DocuSign', 'DrawPlus', 'DuckDuckGo', 'Dynamics AX 2015', 'Dynamics CRM 2011', 'Dynamics CRM 2015', 'Dynamics GP 2015', 'Dynamics NAV 2015', 'Dynamics SL 2015', 'Eclipse Helios', 'Editpad 7', 'Edius', 'Emacs 23.2.1', 'Evergreen', 'Evernote', 'FEKO', 'FL Studio', 'Facebook', 'Feedly', 'Figma', 'FileMaker Pro', 'Final Cut Pro', 'Final Fantasy XV', 'Finale', 'Finder', 'Firebug', 'Firefox', 'Flash Movie Player', 'FlexiSign Pro 8.1', 'Flock', 'Forte', 'FreeMind 0.9.0', 'Freshdesk', 'Fritzing', 'FxPro', 'GIMP', 'GOM Player', 'GTA V Cheats', 'GTDNext.com', 'Garageband 10', 'Geany', 'GeoModeller3D', 'GibbsCAM', 'GitLab', 'Gliffy', 'Gnome', 'GoToMeeting', 'Google Calendar', 'Google Chrome', 'Google Docs', 'Google Drive', 'Google Earth 5', 'Google Instant Search', 'Google Keep', 'Google Mail', 'Google News', 'Google Photos', 'Google Play Music', 'Google Reader', 'Google Slides', 'Google Spreadsheets', 'Groove Music', 'GroupWise 2012', 'Hexagon 2', 'HipChat', 'HoneyView 5.03', 'Houdini', 'IBM Maximo', 'IBM Rational DOORS', 'IMVU', 'IRONCAD', 'Impro-Visor', 'InCopy CC', 'InDesign', 'Inkscape', 'Inpage', 'IntelliJ', 'Internet Explorer', 'IrfanView 4.42', 'Jaws 11.0', 'JetBrains AppCode', 'JetBrains PhpStorm', 'JetBrains PyCharm', 'JetBrains Resharper 6', 'JetBrains RubyMine', 'Jetbrains CLion', 'Jupyter Notebook', 'KDevelop', 'KMPlayer', 'KeyCreator', 'KiCAD', 'Kingsoft Presentation 2016', 'Kingsoft Spreadsheets 2016', 'Kingsoft Writer 2016', 'Krita Painting 3', 'LastPass', 'LibreCAD', 'Libreoffice Writer', 'LightShot', 'Linux Mint', 'LiveChat', 'Logic Pro X', 'MAGIX Movie Edit Pro', 'MOTU Digital Performer 9', 'MPS 2017', 'Mac OS Sierra 10.12', 'Mattermost', 'Maxthon', 'Maxwell Render', 'Media Player Classic (MPC)', 'MediaMonkey', 'MetaTrader MT4', 'Microsoft Edge Browser', 'Microsoft Excel', 'Microsoft OneNote', 'Microsoft Outlook', 'Microsoft PowerPoint', 'Microsoft Projects 2007', 'Microsoft Projects 2010', 'Microsoft Projects 2016', 'Microsoft Teams', 'Microsoft Visio', 'Microsoft Windows 10', 'Microsoft Word', 'Microstation v8i', 'MindManager v19', 'Mindjet Mindmanager 2012', 'Modo', 'Moldflow Adviser', 'Moldflow Insight', 'MuseScore', 'MusicBee', 'MyLibreOfficeMediaFKeys', 'MyLifeOrganized', 'MyPaint', 'Nautilus File Manager 2', 'NetBeans 8', 'Netvibes', 'Notepad2', 'Novell Evolution 2', 'Nuke 10', 'OmniFocus', 'Onshape', 'Open Office Impress', 'Open Office Writer 3', 'OpenSCAD', 'Opera', 'Oracle SQL Developer 4', 'Overwatch 2016', 'PSPad', 'Panic Coda', 'Phoenix Viewer', 'PhotoFiltre', 'Photoshop Elements', 'Photoshop Lightroom', 'Pidgin', 'Pinnacle Studio Ultimate 20', 'Pixelmator', 'Plex', 'Podio', 'Poser Pro', 'PotPlayer', 'Presonus Studio One', 'Prezi', 'Primevera P6 P6', 'Pro Tools', 'ProRealTime', 'QCad', 'Qt Creator', 'QuickTime Player', 'Quickbooks Desktop', 'Quickbooks Online', 'RStudio', 'Red Hat Enterprise', 'Remember the Milk', 'Rhino', 'Rhythmbox', 'Rocket.Chat', 'Roundcube', 'SPSS Modeler', 'Safari Browser', 'Sage Simply Accounting', 'SalesForce', 'Sculptris', 'SharePoint 2016', 'ShareX 12.2.0', 'SharpDevelop 4.0', 'Siemens NX 11', 'Sierra Chart', 'Silhouette Studio', 'Sketch 3', 'SketchUp', 'Skype 5.5', 'Skype for Business (Lync) 2016', 'Slack', 'Smartplant Review', 'Smite', 'Solid Edge', 'SolidWorks', 'SolveSpace', 'Sonar 2015', 'Soundforge', 'Source Insight', 'Spotify', 'Sticky Notes', 'Sublime Text', 'Surfcam', 'Sway 2016', 'Tableau', 'Tally 9.0', 'Teamcenter', 'Tekla Structures 14.0', 'Texmaker 4.0.2', 'TextMate 2', 'Thunderbird', 'Todoist', 'TopSolid', 'Total Commander 8', 'TradeStation', 'Trello', 'Tupi', 'Twitter', 'Ulead PhotoImpact 8', 'UltraEdit', 'Unity Desktop', 'Unity3D 5', 'Unreal Engine', 'VCarve Pro', 'VLC Media Player', 'VariCAD', 'Vectorworks', 'Vegas Pro 14', 'ViaCAD', 'VideoPad Video Editor', 'Vim', 'Virtual DJ', 'VistaSwitcher', 'Visual Studio 2015', 'Visual Studio Code', 'Vuze', 'WavePad Sound Editor', 'WeVideo', 'Webflow', 'Wikipedia', 'WinRAR', 'WinSCP 5', 'Winamp Media Player', 'Windows  to Move and Resize Windows', 'Windows 10 Command Prompt', 'Windows 10 File Explorer', 'Windows 10 Photo Viewer and Video Editor', 'Windows 10 Power User Command', 'Windows 10 Screenshot', 'Windows Desktop and Taskbar', 'Windows Media Player 11', 'Windows Movie Maker', 'Windows Remote Desktop', 'Windows Run Commands, Settings, and Start Menu', 'Wondershare Editor', 'WordPress', 'X-Plane', 'XYplorer', 'Xamarin Studio (MonoDevelop)', 'Yahoo Mail', 'Youtube Player', 'ZBrush 4', 'ZenDesk', 'Zerodha Trader', 'Zimbra Collaboration Suite 8', 'Zoho Desk', 'Zoho Mail', 'Zoho Projects', 'Zoho Sheet', 'Zoho Show', 'Zoho Writer', 'Zoom 5', 'gEDA', 'gThumb', 'gedit 2.3', 'iBooks', 'iClone 7', 'iMovie', 'iTunes', 'jEdit', 'progeCAD', 'qBittorrent', 'tmux', 'vSphere Client', 'vi'];

    return (
        <Container component="main" className={classes.container}>
            <CssBaseline/>
            <div className={classes.searchContainer}>
                <Avatar className={classes.avatar}>
                    <KeyboardHideIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    All Shortcuts in One Place
                </Typography>
                <form className={classes.searchInputForm} noValidate onSubmit={handleSubmit}>
                    <Autocomplete
                        id="program-selection"
                        className={classes.programBar}
                        options={programs_available}
                        value={selectedProgram}
                        onChange={(event, newValue) => {
                            setSelectedProgram(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="Program" variant="outlined"/>}
                    />
                    <TextField
                        value={textSearch ? query : inputShortcut}
                        className={classes.searchBar}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="search"
                        name="search"
                        autoComplete="search"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Button variant={textSearch ? "contained" : "text"}
                                            color={textSearch ? "primary" : "default"}
                                            onClick={handleSearchTypeChange}><TextFieldsIcon/></Button>
                                    <Button variant={textSearch ? "text" : "contained"}
                                            color={textSearch ? "default" : "primary"}
                                            onClick={handleSearchTypeChange}><KeyboardIcon/></Button>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button type="submit"><SearchIcon/></Button>
                                </InputAdornment>
                            ),
                        }}
                    />
                </form>
            </div>
            <div className={classes.search_description}>
                <Typography component="h2" variant="subtitle2">
                    You can:
                </Typography>
                <Button variant="contained" color="primary" className={classes.search_desc_button}><TextFieldsIcon/></Button>
                <Typography component="h2" variant="subtitle2">
                    Search by text
                </Typography>
                <Button variant="contained" color="primary" className={classes.search_desc_button}><KeyboardIcon/></Button>
                <Typography component="h2" variant="subtitle2">
                    Search by keyboard shortcut
                </Typography>
            </div>
            <div className={classes.subtitle}>
                <Typography component="h2" variant="h6">
                    Find shortcuts for...
                </Typography>
            </div>
            <div className={classes.programs}>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/ms-excel.png"
                                                                                   className={classes.programAvatars}/></Paper>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/ms-powerpoint.png"
                                                                                   className={classes.programAvatars}/></Paper>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/ms-word.png"
                                                                                   className={classes.programAvatars}/></Paper>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/windows.png"
                                                                                   className={classes.programAvatars}/></Paper>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/vscode.png"
                                                                                   className={classes.programAvatars}/></Paper>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/gmail.png"
                                                                                   className={classes.programAvatars}/></Paper>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/openoffice.png"
                                                                                   className={classes.programAvatars}/></Paper>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/adobe-acrobat.png"
                                                                                   className={classes.programAvatars}/></Paper>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/adobe-photoshop.png"
                                                                                   className={classes.programAvatars}/></Paper>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/adobe-indesign.png"
                                                                                   className={classes.programAvatars}/></Paper>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/google-photos.png"
                                                                                   className={classes.programAvatars}/></Paper>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/ms-visio.png"
                                                                                   className={classes.programAvatars}/></Paper>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/ms-outlook.png"
                                                                                   className={classes.programAvatars}/></Paper>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/zoom.png"
                                                                                   className={classes.programAvatars}/></Paper>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/chrome.png"
                                                                                   className={classes.programAvatars}/></Paper>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/vlc.png"
                                                                                   className={classes.programAvatars}/></Paper>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/atom.png"
                                                                                   className={classes.programAvatars}/></Paper>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/overwatch.png"
                                                                                   className={classes.programAvatars}/></Paper>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/apple-keynote.png"
                                                                                   className={classes.programAvatars}/></Paper>
                <Paper elevation={3} className={classes.programContainers}><Avatar alt="Your Program here"
                                                                                   src="https://shortcutworld.com/imgsrv/appicons-lg/apple-numbers.png"
                                                                                   className={classes.programAvatars}/></Paper>
            </div>
            <div className={classes.subtitle}>
                <Typography component="h2" variant="h6">
                    ... and many more
                </Typography>
            </div>
        </Container>
    );
}
