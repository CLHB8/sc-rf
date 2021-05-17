import React, {useEffect, useState} from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {makeStyles} from '@material-ui/core/styles';
import KeyboardHideIcon from "@material-ui/icons/KeyboardHide";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {useHistory, useLocation} from "react-router-dom";
import {get_Search_Results} from './services/resultsService'
import {Grid} from "@material-ui/core";
import Loading from "./Loading";
import {isWindows, isMacOs} from 'react-device-detect';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {withRouter} from 'react-router-dom';
import Link from '@material-ui/core/Link'
import Pagination from "@material-ui/lab/Pagination";
import TextFieldsIcon from '@material-ui/icons/TextFields';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import YoutubeSearchedForIcon from '@material-ui/icons/YoutubeSearchedFor';

const useStyles = makeStyles((theme) => ({
    container: {
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    searchTextField: {
        margin: theme.spacing(1),
    },
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        width: '100%',
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    avatar: {
        margin: theme.spacing(1),
        marginRight: theme.spacing(5),
        backgroundColor: theme.palette.secondary.main,
        width: theme.spacing(6),
        height: theme.spacing(6),
    },
    avatar_empty_search: {
        margin: theme.spacing(1),
        marginRight: theme.spacing(3),
        marginLeft: theme.spacing(3),
        backgroundColor: theme.palette.primary.main,
        width: theme.spacing(6),
        height: theme.spacing(6),
    },
    os_list: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 650,
    },
    loadingGrid: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
    },
    tableContainer: {
        marginBottom: theme.spacing(3),
    },
    searchBar: {
        width: '100vw',
        maxWidth: '650px',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        margin: theme.spacing(0.5),
    },
    programBar: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        margin: theme.spacing(0.5),
        width: '25vw',
        maxWidth: '300px',
    },
    searchInputForm: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    didYouMean: {
        borderBottom: theme.spacing(2),
    },
    pagination: {
        margin: theme.spacing(1),
        marginBottom: theme.spacing(2),
    },
    empty_search: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    }
}));

const NUMBER_OF_DISPLAYED_SHORTCUTS = 10;

function ResultsPage() {
    const classes = useStyles();
    const location = useLocation();
    let url_params = new URLSearchParams(location.search);
    const url_search_type = url_params.get("type");
    const url_search_type_bool = (url_search_type === 'true');
    const url_os = parseInt(url_params.get("os"));
    const url_program = url_params.get("program");
    const url_query = url_params.get("query");
    const url_sc_query = url_params.get("sc-query");

    const [loading, setLoading] = useState(true);
    const [textSearch, setTextSearch] = useState((url_search_type === null) ? true : url_search_type_bool);
    const [currentPage, setCurrentPage] = React.useState(1);

    const [tabsValue, setTabsValue] = useState((url_os === null) ? 0 : url_os);
    const [selectedProgram, setSelectedProgram] = useState((url_program === 'null') ? 'All' : url_program);
    const [inputShortcut, setInputShortcut] = useState((url_sc_query === null) ? '' : url_sc_query);
    const [query, setQuery] = useState((url_query === null) ? '' : url_query);

    const [searchResults, setSearchResults] = useState([]);
    const [correctedQuery, setCorrectedQuery] = useState('');
    const [misspell, setMisspell] = useState(false);

    useEffect(() => {
        if (tabsValue === null) {
            setTabsValue(isWindows ? 0 : (isMacOs ? 1 : 2));
        }
        get_Search_Results(textSearch, query, inputShortcut, selectedProgram, tabsValue).then(data => {
            setSearchResults(data.results);
            setCorrectedQuery(data.correctedQuery);
            setMisspell(data.misspell);
            setLoading(false);
            console.log(searchResults);
        })
    }, []);

    const history = useHistory();
    const handleSubmit = (evt) => {
        evt.preventDefault();
        // history.push('/search?os=' + tabsValue + '&program=' + selectedProgram + '&query=' + query);
        if (textSearch) {
            history.push('/search?type=' + textSearch + '&os=' + tabsValue + '&program=' + selectedProgram + '&query=' + query);
        } else {
            history.push('/search?type=' + textSearch + '&os=' + tabsValue + '&program=' + selectedProgram + '&sc-query=' + inputShortcut);
        }
        window.location.reload()
    }
    const handleDidYouMean = (evt) => {
        evt.preventDefault();
        // history.push('/search?os=' + tabsValue + '&program=' + selectedProgram + '&query=' + correctedQuery);
        history.push('/search?type=' + textSearch + '&os=' + tabsValue + '&program=' + selectedProgram + '&query=' + correctedQuery);
        window.location.reload()
    }

    const handleTabsChange = (evt, newValue) => {
        evt.preventDefault();
        // history.push('/search?os=' + newValue + '&program=' + selectedProgram + '&query=' + query);
        if (textSearch) {
            history.push('/search?type=' + textSearch + '&os=' + newValue + '&program=' + selectedProgram + '&query=' + query);
        } else {
            history.push('/search?type=' + textSearch + '&os=' + newValue + '&program=' + selectedProgram + '&sc-query=' + inputShortcut);
        }
        window.location.reload()
    };

    const handleSearchTypeChange = () => {
        setTextSearch(!textSearch);
        setQuery("");
        setInputShortcut("");
    }

    const handleKeyDown = (evt) => {
        // todo: add a pulldown menu with buttons like alt, f3, f11
        if (evt.key !== 'Enter') {
            evt.preventDefault();
            if (evt.key === 'Control') {
                evt.key = 'Ctrl'
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

    const goToHomepage = (evt) => {
        evt.preventDefault();
        history.push('/');
    }

    const programs_available = ['All', '1Password', '3D Coat', 'AVS Audio Editor', 'AVS Video Editor', 'Ableton Live 9', 'Access 2010', 'Access 2016', 'Ace Projects', 'Act! CRM', 'Adobe Acrobat Pro', 'Adobe After Effects CC', 'Adobe After Effects CS5', 'Adobe Animate CC', 'Adobe Audition CC', 'Adobe Captivate 2017', 'Adobe ColdFusion Builder 2.0', 'Adobe Dreamweaver', 'Adobe Fireworks MX', 'Adobe Flash Professional', 'Adobe Illustrator', 'Adobe Photoshop', 'Adobe Premiere CC', 'Adobe Reader', 'Adobe RoboHelp', 'Adobe XD (Experience Design)', 'Age of Empires', 'Alphacam', 'Altium Designer', 'Amarok', 'Amazon Kindle', 'Amazon Prime Video', 'Android Emulator', 'Android Studio', 'Anim8or', 'Anime Studio', 'Ansys Mechanical', 'Apple Calendar', 'Apple Keynote', 'Apple Mail', 'Apple Motion', 'Apple Notes', 'Apple Numbers', 'Apple Pages', 'Apple Photos', 'Apple XCode 8', 'Aptana Studio 3', 'ArchiCAD 20', 'ArtRage 4.5 5', 'Asana', 'Aspire', 'Atlasian JIRA Agile', 'Atlassian Confluence 6', 'Atlassian Crucible', 'Atlassian FishEye 4', 'Atom (text editor) 1.0', 'Audacity 2', 'AutoCAD', 'AutoCad Architecture', 'Autodesk 3ds Max', 'Autodesk Inventor', 'Autodesk Maya', 'Autodesk Mudbox', 'Autodesk Revit Architecture', 'Autodesk SketchBook Pro', 'Avid Media Composer 7', 'Axialis IconWorkshop', 'Balsamiq Mockups', 'Bash', 'Battlefield 12', 'Beyond Compare', 'Bitbucket', 'Bitcomet', 'Blender 3D', 'Brackets', 'BrainSuite', 'Brave Browser', 'BricsCAD', 'CA Client Automation', 'CINEMA 4D', 'Cabinet Vision', 'Calibre', 'Call of Duty', 'Camtasia', 'Chief Architect', 'Civilization V', 'Clarizen', 'Clementine Player', 'Clink', 'Clip Studio Paint (Manga Studio)', 'Cloud9', 'CodeLite 10', 'ComplyPro 2017B', 'Compressor', 'Comsol 5', 'Corel Designer X7', 'Corel Draw X8', 'Corel Painter 2017', 'Corel PhotoPaint X6', 'Corel Quattro Pro X8', 'Corel Ventura 10', 'Corel VideoStudio X9.5', 'Counter Strike Source', 'CrazyTalk 8', 'Cubase', 'CuteFTP', 'CyberLink PhotoDirector 8', 'Cyberduck', 'DAZ Studio', 'DaVinci Resolve 14', 'Daz 3D Bryce 7', 'Daz 3D Carrara 8', 'Desk.com', 'Directory Opus', 'Discourse', 'DocuSign', 'DrawPlus', 'DuckDuckGo', 'Dynamics AX 2015', 'Dynamics CRM 2011', 'Dynamics CRM 2015', 'Dynamics GP 2015', 'Dynamics NAV 2015', 'Dynamics SL 2015', 'Eclipse Helios', 'Editpad 7', 'Edius', 'Emacs 23.2.1', 'Evergreen', 'Evernote', 'FEKO', 'FL Studio', 'Facebook', 'Feedly', 'Figma', 'FileMaker Pro', 'Final Cut Pro', 'Final Fantasy XV', 'Finale', 'Finder', 'Firebug', 'Firefox', 'Flash Movie Player', 'FlexiSign Pro 8.1', 'Flock', 'Forte', 'FreeMind 0.9.0', 'Freshdesk', 'Fritzing', 'FxPro', 'GIMP', 'GOM Player', 'GTA V Cheats', 'GTDNext.com', 'Garageband 10', 'Geany', 'GeoModeller3D', 'GibbsCAM', 'GitLab', 'Gliffy', 'Gnome', 'GoToMeeting', 'Google Calendar', 'Google Chrome', 'Google Docs', 'Google Drive', 'Google Earth 5', 'Google Instant Search', 'Google Keep', 'Google Mail', 'Google News', 'Google Photos', 'Google Play Music', 'Google Reader', 'Google Slides', 'Google Spreadsheets', 'Groove Music', 'GroupWise 2012', 'Hexagon 2', 'HipChat', 'HoneyView 5.03', 'Houdini', 'IBM Maximo', 'IBM Rational DOORS', 'IMVU', 'IRONCAD', 'Impro-Visor', 'InCopy CC', 'InDesign', 'Inkscape', 'Inpage', 'IntelliJ', 'Internet Explorer', 'IrfanView 4.42', 'Jaws 11.0', 'JetBrains AppCode', 'JetBrains PhpStorm', 'JetBrains PyCharm', 'JetBrains Resharper 6', 'JetBrains RubyMine', 'Jetbrains CLion', 'Jupyter Notebook', 'KDevelop', 'KMPlayer', 'KeyCreator', 'KiCAD', 'Kingsoft Presentation 2016', 'Kingsoft Spreadsheets 2016', 'Kingsoft Writer 2016', 'Krita Painting 3', 'LastPass', 'LibreCAD', 'Libreoffice Writer', 'LightShot', 'Linux Mint', 'LiveChat', 'Logic Pro X', 'MAGIX Movie Edit Pro', 'MOTU Digital Performer 9', 'MPS 2017', 'Mac OS Sierra 10.12', 'Mattermost', 'Maxthon', 'Maxwell Render', 'Media Player Classic (MPC)', 'MediaMonkey', 'MetaTrader MT4', 'Microsoft Edge Browser', 'Microsoft Excel', 'Microsoft OneNote', 'Microsoft Outlook', 'Microsoft PowerPoint', 'Microsoft Projects 2007', 'Microsoft Projects 2010', 'Microsoft Projects 2016', 'Microsoft Teams', 'Microsoft Visio', 'Microsoft Windows 10', 'Microsoft Word', 'Microstation v8i', 'MindManager v19', 'Mindjet Mindmanager 2012', 'Modo', 'Moldflow Adviser', 'Moldflow Insight', 'MuseScore', 'MusicBee', 'MyLibreOfficeMediaFKeys', 'MyLifeOrganized', 'MyPaint', 'Nautilus File Manager 2', 'NetBeans 8', 'Netvibes', 'Notepad2', 'Novell Evolution 2', 'Nuke 10', 'OmniFocus', 'Onshape', 'Open Office Impress', 'Open Office Writer 3', 'OpenSCAD', 'Opera', 'Oracle SQL Developer 4', 'Overwatch 2016', 'PSPad', 'Panic Coda', 'Phoenix Viewer', 'PhotoFiltre', 'Photoshop Elements', 'Photoshop Lightroom', 'Pidgin', 'Pinnacle Studio Ultimate 20', 'Pixelmator', 'Plex', 'Podio', 'Poser Pro', 'PotPlayer', 'Presonus Studio One', 'Prezi', 'Primevera P6 P6', 'Pro Tools', 'ProRealTime', 'QCad', 'Qt Creator', 'QuickTime Player', 'Quickbooks Desktop', 'Quickbooks Online', 'RStudio', 'Red Hat Enterprise', 'Remember the Milk', 'Rhino', 'Rhythmbox', 'Rocket.Chat', 'Roundcube', 'SPSS Modeler', 'Safari Browser', 'Sage Simply Accounting', 'SalesForce', 'Sculptris', 'SharePoint 2016', 'ShareX 12.2.0', 'SharpDevelop 4.0', 'Siemens NX 11', 'Sierra Chart', 'Silhouette Studio', 'Sketch 3', 'SketchUp', 'Skype 5.5', 'Skype for Business (Lync) 2016', 'Slack', 'Smartplant Review', 'Smite', 'Solid Edge', 'SolidWorks', 'SolveSpace', 'Sonar 2015', 'Soundforge', 'Source Insight', 'Spotify', 'Sticky Notes', 'Sublime Text', 'Surfcam', 'Sway 2016', 'Tableau', 'Tally 9.0', 'Teamcenter', 'Tekla Structures 14.0', 'Texmaker 4.0.2', 'TextMate 2', 'Thunderbird', 'Todoist', 'TopSolid', 'Total Commander 8', 'TradeStation', 'Trello', 'Tupi', 'Twitter', 'Ulead PhotoImpact 8', 'UltraEdit', 'Unity Desktop', 'Unity3D 5', 'Unreal Engine', 'VCarve Pro', 'VLC Media Player', 'VariCAD', 'Vectorworks', 'Vegas Pro 14', 'ViaCAD', 'VideoPad Video Editor', 'Vim', 'Virtual DJ', 'VistaSwitcher', 'Visual Studio 2015', 'Visual Studio Code', 'Vuze', 'WavePad Sound Editor', 'WeVideo', 'Webflow', 'Wikipedia', 'WinRAR', 'WinSCP 5', 'Winamp Media Player', 'Windows  to Move and Resize Windows', 'Windows 10 Command Prompt', 'Windows 10 File Explorer', 'Windows 10 Photo Viewer and Video Editor', 'Windows 10 Power User Command', 'Windows 10 Screenshot', 'Windows Desktop and Taskbar', 'Windows Media Player 11', 'Windows Movie Maker', 'Windows Remote Desktop', 'Windows Run Commands, Settings, and Start Menu', 'Wondershare Editor', 'WordPress', 'X-Plane', 'XYplorer', 'Xamarin Studio (MonoDevelop)', 'Yahoo Mail', 'Youtube Player', 'ZBrush 4', 'ZenDesk', 'Zerodha Trader', 'Zimbra Collaboration Suite 8', 'Zoho Desk', 'Zoho Mail', 'Zoho Projects', 'Zoho Sheet', 'Zoho Show', 'Zoho Writer', 'Zoom 5', 'gEDA', 'gThumb', 'gedit 2.3', 'iBooks', 'iClone 7', 'iMovie', 'iTunes', 'jEdit', 'progeCAD', 'qBittorrent', 'tmux', 'vSphere Client', 'vi'];

    return (
        <Container component="main" className={classes.container}>
            <CssBaseline/>
            <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Avatar className={classes.avatar} onClick={goToHomepage}>
                        <KeyboardHideIcon/>
                    </Avatar>
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
                </Toolbar>
            </AppBar>
            <div className={classes.os_list}>
                <Tabs
                    value={tabsValue}
                    onChange={handleTabsChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Windows"/>
                    <Tab label="MacOS"/>
                    <Tab label="Linux"/>
                    <Tab label="Web Application"/>
                </Tabs>
            </div>
            {misspell ? (
                <div>
                    <Typography className={classes.didYouMean} variant="h6">
                        Did you mean:
                        <Link onClick={handleDidYouMean}>
                            {' ' + correctedQuery}
                        </Link>
                    </Typography>
                </div>
            ) : ''}
            {loading ? (
                <Grid item className={classes.loadingGrid}>
                    <Loading/>
                </Grid>
            ) : (
                <div>{searchResults.length > 0 ? (
                    <Grid>
                        <TableContainer component={Paper} className={classes.tableContainer}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Program</TableCell>
                                        <TableCell>Shortcut</TableCell>
                                        <TableCell>Description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {searchResults.slice(
                                        NUMBER_OF_DISPLAYED_SHORTCUTS *
                                        (currentPage - 1),
                                        NUMBER_OF_DISPLAYED_SHORTCUTS *
                                        currentPage
                                    ).map((result) => (
                                        <TableRow key={result.id}>
                                            <TableCell component="th" scope="row">
                                                {result.program}
                                            </TableCell>
                                            <TableCell>{result.shortcut}</TableCell>
                                            <TableCell>{result.description}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Pagination
                            page={currentPage}
                            count={Math.ceil(
                                searchResults.length /
                                NUMBER_OF_DISPLAYED_SHORTCUTS
                            )}
                            color="primary"
                            shape="rounded"
                            showFirstButton
                            showLastButton
                            onChange={(event, page) =>
                                setCurrentPage(page)
                            }
                            className={classes.pagination}
                        />
                    </Grid>
                ) : (
                    <div className={classes.empty_search}>
                        <Avatar className={classes.avatar_empty_search} onClick={goToHomepage}>
                            <YoutubeSearchedForIcon/>
                        </Avatar>
                        <Typography component="h2" variant="h6">
                            Uh-oh, there are no results for this search...
                        </Typography>
                    </div>
                )}</div>
            )}
        </Container>
    );
}

export default withRouter(ResultsPage);
