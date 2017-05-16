var fakeElementSelectors = (function () {

    var domParser = new DOMParser();

    var getFakeElement = function (definition) {
        definition.dom = domParser.parseFromString(definition.html, "text/html");

        definition.getElement = function() {
            return definition.dom.querySelector(definition.selector);
        };
        return definition;
    };
    return [
        getFakeElement({
            type: "element with id",
            description: "should get element tag, element id",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            "<input type=\"text\" id=\"login\" /><br/>" +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "input#login",
            path:"html body form input#login"
        }),
        getFakeElement({
            type: "input with type password",
            description: "should get parent tag, element tag, element type",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="password"/><br/>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: 'form > input[type="password"]',
            path:"html body form input[type=\"password\"]"
        }),
        getFakeElement({
            type: "input with type submit",
            description: "should get parent tag, element tag, element type",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="submit"/><br/>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: 'form > input[type="submit"]',
            path:"html body form input[type=\"submit\"]"
        }),
        getFakeElement({
            type: "input with type text",
            description: "should get parent tag, element tag, element type",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text"/><br/>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: 'form > input[type="text"]',
            path:"html body form input[type=\"text\"]"
        }),
        getFakeElement({
            type: "input with type email",
            description: "should get parent tag, element tag, element type",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            "<input type=\"email\"/><br/>" +
            "</form>" +
            "</body>" +
            "</html>"
            ,
            selector: "form > input[type=\"email\"]",
            path:"html body form input[type=\"email\"]"
        }),
        getFakeElement({
            type: "simple button",
            description: "should get parent tag, element tag",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            "<button>Click</button><br/>" +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > button",
            path:"html body form button"
        }),
        getFakeElement({
            type: "simple img",
            description: "should get parent tag, element tag",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<img/><br/>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > img",
            path:"html body form img"
        }),
        getFakeElement({
            type: "element a as button",
            description: "should get parent tag, element tag",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<a onclick="logIn()"/><br/>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > a",
            path:"html body form a"
        }),
        getFakeElement({
            type: "element with className",
            description: "should get parent tag, element tag, element className if other element with same tag",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<button class="btn">Login</button>' +
            '<button class="other-btn">LoginOther</button>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > button.btn",
            path:"html body form button.btn"
        }),
        getFakeElement({
            type: "element with parent with id",
            description: "should get parent tag, parent id, element tag ",
            html:
            "<html>" +
            "<body>" +
            "<form id='login-form'>" +
            '<button>Login</button>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form#login-form > button",
            path:"html body form#login-form button"
        }),
        getFakeElement({
            type: "element with sublings with same tags",
            description: "should get parent tag, element tag, element number ",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" /> <br\>' +
            '<input type="text" /> <br\>' +
            '<input type="text" /> <br\>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > input[type=\"text\"]:nth-child(1)",
            path:"html body form input[type=\"text\"]"
        }),
        getFakeElement({
            type: "input with name",
            description: "should get parent tag, element tag, element name ",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" name="first"  /> <br\>' +
            "</form>"+
            '<input type="text" name="first"  /> <br\>' +
            "</body>" +
            "</html>",
            selector: "form > input[name=\"first\"]"
        }),
        getFakeElement({
            type: "input with id on Russian language",
            description: "should get input with id",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" id="логин"  /> <br\>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "input#логин",
            path:"html body form input#логин"
        }),
        getFakeElement({
            type: "input with underscore id",
            description: "should get input with id",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" id="_login"  /> <br\>' +
            "</form>",
            selector: "input#_login",
            path:"html body form input#_login"
        }),
        getFakeElement({
            type: "input with dash line id",
            description: "should get input with id",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" id="login-username"  /> <br\>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "input#login-username",
            path:"html body form input#login-username"
        }),
        getFakeElement({
            type: "input with UPPER CASE id",
            description: "should get input with id",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" id="LOGIN" /> <br\>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "input#LOGIN",
            path:"html body form input#LOGIN"
        }),
        getFakeElement({
            type: "input with number id",
            description: "should get input with id",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" id="line21"  /> <br\>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "input#line21",
            path:"html body form input#line21"
        }),
        getFakeElement({
            type: "input with ascii char id",
            description: "should get input with id",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" id="&#002;test"  /> <br\>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "input#\\02 test"
        }),
        getFakeElement({
            type: "input with many same siblings",
            description: "should get parent tag, element tag",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" class="first"/> <br\>' +
            '<input type="text" class="first"/> <br\>' +
            '<input type="text" class="first"/> <br\>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > input:nth-child(3)",
            path:"html body form input.first"
        }),
        getFakeElement({
            type: "input when some parent with id",
            description: "should get main parent id if needed, all parent tags,  element tag",
            html:
            "<html>" +
            "<body>" +
            "<form id='loginForm'>" +
            '<div>' +
            '<input type="text" class="first"/> <br\>' +
            '</div>' +
            "</form>" +
            '<div>' +
            '<input type="text" class="first"/> <br\>' +
            '</div>',
            selector: "form#loginForm input"
        }),
        getFakeElement({
            type: "input with few class names",
            description: "should get main parent id, all parent tags,  element tag",
            html:
            "<html>" +
            "<body>" +
            "<form id='loginForm'>" +
            '<input type="text" class="first login"/> <br\>' +
            '<input type="text" class="first two"/> <br\>' +
            '<input type="text" class="first three"/> <br\>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form#loginForm > input.first.login",
            path:"html body form#loginForm input.first.login"
        }),
        getFakeElement({
            type: "input with type tel",
            description: "should get parent tag, element tag, element type",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="tel"/><br/>' +
            "</form>" +
            "</body>" +
            "</html>"
            ,
            selector: 'form > input[type="tel"]'
        }),
        getFakeElement({
            type: "input with type number",
            description: "should get parent tag, element tag, element type",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="number"/><br/>' +
            "</form>" +
            "</body>" +
            "</html>"
            ,
            selector: 'form > input[type="number"]'
        }),
        getFakeElement({
            type: "input with unique name",
            description: "should get parent tag, element tag, element name ",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" name="first"  /> <br\>' +
            '<input type="text" name="second" /> <br\>' +
            '<input type="text" name="third" /> <br\>' +
            "</form>"+
            "</body>" +
            "</html>",
            selector: "input[name=\"first\"]"
        }),
        getFakeElement({
            type: "inputs with names",
            description: "should get parent tag, element tag, element name ",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" name="first"  /> <br\>' +
            '<input type="text" name="first" /> <br\>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > input[type=\"text\"]:nth-child(1)"
        }),
        getFakeElement({
            type: "inputs with same unique id",
            description: "should get main parent id, element tag, element id",
            html:
            "<html>" +
            "<body>" +
            "<form id='loginForm'>" +
            '<input type="text" id="first"/> <br\>' +
            "</form>" +
            '<input type="text" id="first"/> <br\>' +
            "</body>" +
            "</html>",
            selector: "form#loginForm > input#first"
        }),
        getFakeElement({
            type: "elements with same id, but with different tags",
            description: "should get element tag, element id",
            html:
            "<html>" +
            "<body>" +
            "<form id='loginForm'>" +
            '<input type="text" id="first"/> <br\>' +
            '<img  id="first"/> <br\>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "input#first"
        }),
        getFakeElement({
            type: "inputs with same id, and same path",
            description: "should get main parent id, element tag, element id",
            html:
            "<html>" +
            "<body>" +
            "<form id='loginForm'>" +
            '<input type="text" id="first"/> <br\>' +
            '<input type="text" id="first"/> <br\>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form#loginForm > input[type=\"text\"]:nth-child(1)"
        }),
        getFakeElement({
            type: "input with type text in big DOM",
            description: "should get simplified selector",
            html:
            "<html>" +
            "<body>" +
            "<div>" +
            "<div>" +
            "<div>" +
            "<div>" +
            "<div>" +
            "<div>" +
            "<div>" +
            "<div>" +
            "<form>" +
            '<input type="text"/><br/>' +
            "</form>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</body>" +
            "</html>",
            selector: 'form > input[type="text"]'
        }),
        getFakeElement({
            type: "input with type text in big DOM with parent form without attributes",
            description: "should get main parent name, element tag, element type",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            "<div>" +
            "<div>" +
            '<input type="text"/> <br\>' +
            "</div>" +
            "</div>" +
            "</form>" +
            "<div>" +
            "<form>" +
            "<div>" +
            "<div>" +
            '<input type="text"/> <br\>' +
            "</div>" +
            "</div>" +
            "</form>" +
            "</div>" +
            "</body>" +
            "</html>",
            selector: "form > div > div > input[type=\"text\"]"
        }),
        getFakeElement({
            type: "input with type text in big form with id with nesting div containers",
            description: "should get main parent id, element tag, element id",
            html:
            "<html>" +
            "<body>" +
            "<form id='loginForm'>" +
            "<div>" +
            "<div>" +
            "<div>" +
            '<input type="text"/> <br\>' +
            "</div>" +
            "</div>" +
            "</div>" +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form#loginForm input[type=\"text\"]"
        }),
        getFakeElement({
            type: "input with type text in big DOM with parent id and nesting div containers",
            description: "should get main parent id, element tag, element id",
            html:
            "<html>" +
            "<body>" +
            "<div id='loginForm'>" +
            "<div>" +
            "<div>" +
            "<div>" +
            '<input type="text"/> <br\>' +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</body>" +
            "</html>",
            selector: "div#loginForm input[type=\"text\"]"
        }),
        getFakeElement({
            type: "input with type text in big DOM with parent id",
            description: "should get main parent id, element tag",
            html:
            "<html>" +
            "<body>" +
            "<div id='loginForm'>" +
            "<div>" +
            "<div>" +
            "<div>" +
            "<input type=\"text\"/> <br\>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div>" +
            "<input type=\"text\"/> <br\>" +
            "</div>" +
            "</div>" +
            "</body>" +
            "</html>",
            selector: "div#loginForm div > div > input[type=\"text\"]"
        }),
        getFakeElement({
            type: "input with type text in big DOM with parent form with name",
            description: "should get main parent name, element tag, element type",
            html:
            "<html>" +
            "<body>" +
            "<form name=\"loginForm\">" +
            "<div>" +
            "<div>" +
            "<div>" +
            "<input type=\"text\"/> <br\>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form[name=\"loginForm\"] input[type=\"text\"]"
        }),
        getFakeElement({
            type: "empty DOM with body,head only",
            description: "should get html, body",
            html:
            "<html>" +
            "<head>" +
            "</head>"+
            "<body>" +
            "</body>" +
            "</html>",
            selector: "html > body"
        }),
        getFakeElement({
            type: "element with ember autogenerated id",
            description: "should get element tag",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            "<input type=\"text\" id=\"ember1\" /><br/>" +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > input[type=\"text\"]",
            path:"html body form input[type=\"text\"]"
        }),
        getFakeElement({
            type: "element with yandex autogenerated id",
            description: "should get element tag",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            "<input type=\"text\" id=\"uniq7956006594467908\" /><br/>" +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > input[type=\"text\"]"
        }),
        getFakeElement({
            type: "element with id contains digits, underscore, dash only",
            description: "should get element tag",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            "<input type=\"text\" id=\"_79-\" /><br/>" +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > input[type=\"text\"]"
        }),
        getFakeElement({
            type: "element with id contains digits more 3",
            description: "should get element tag",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            "<input type=\"text\" id=\"some7924test\" /><br/>" +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > input[type=\"text\"]"
        }),
        getFakeElement({
            type: "element with facebook autogenerated className",
            description: "should get parent tag, element tag, element className, nth-child",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<button class="_53jh">Login</button>' +
            '<button class="other-btn">LoginOther</button>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > button:nth-child(1)"
        }),
        getFakeElement({
            type: "element with facebook autogenerated className like 16 bit hash",
            description: "should get parent tag, element tag, element className, nth-child",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<button class="ab-12cd-ef123abcd89">Login</button>' +
            '<button class="other-btn">LoginOther</button>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > button:nth-child(1)"
        }),
        getFakeElement({
            type: "element with random id Cincinnati Insurance",
            description: "should get element tag",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            "<input type=\"text\" id=\"defaultcontent_0_leftrailleftcontente1efd0ed990a4688854f87cc2cc522f0_0_username\" /><br/>" +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > input[type=\"text\"]"
        }),
        getFakeElement({
            type: "element with id Experian",
            description: "should get element with id",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            "<input type=\"text\" id=\"ext-gen12\" /><br/>" +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "input#ext-gen12"
        }),
        getFakeElement({
            type: "element with id ASP.NET",
            description: "should get element with id",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            "<input type=\"text\" id=\"ctl00_ContentPlaceHolder1_wpz_ICBB2SignIn1_Input_App_ctlApplicationICBB2SignIn1InputApp0_ICBB2SignIn1_Input_App_Field_UserName_I\" /><br/>" +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "input#ctl00_ContentPlaceHolder1_wpz_ICBB2SignIn1_Input_App_ctlApplicationICBB2SignIn1InputApp0_ICBB2SignIn1_Input_App_Field_UserName_I"
        }),
        getFakeElement({
            type: "element with random id Evault Backup Portal",
            description: "should get element tag",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            "<input type=\"text\" id=\"UserName4122D1F1DBCA462A849AF0095B4279BF\" /><br/>" +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > input[type=\"text\"]"
        }),
        getFakeElement({
            type: "element with random id Intl Farming",
            description: "should get element tag",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            "<input type=\"text\" id=\"c31c383e70ed40dd824d81f2bfc99f28\" /><br/>" +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > input[type=\"text\"]"
        }),
        getFakeElement({
            type: "find correct password selector for https://account.box.com/login",
            description: "should get element tag",
            html:
            "<html>" +
            "<body>" +
            "<form id=\"login-form\" method=\"POST\" action=\"/login?redirect_url=%2F\">" +
            "<div class=\"login-container\"> " +
                "<h1>Sign In to Your Account</h1> " +
                "<label class=\"form-field\"> " +
                "<span>Email Address</span>" +
                    "<input type=\"text\" name=\"login\" class=\"inp-full-width\" >" +
                "</label>" +
                "<label class=\"form-field\"> " +
                    "<span>Password</span>" +
                    "<input type=\"password\" name=\"password\" class=\"inp-full-width\">" +
                "</label> " +
                "<div class=\"form-buttons\">" +
                    "<button type=\"submit\" class=\"btn btn-primary btn-full-width\"> Log In</button>" +
                "</div> " +
                "<input type=\"text\" style=\"display: none\" name=\"_pw_sql\"> " +
                "<input type=\"hidden\" name=\"request_token\" value=\"107909d2a33f7c81a985412156208dc23810d564601261621e95fcc36f40ae11\">" +
                "<input type=\"hidden\" name=\"redirect_url\" value=\"\/\">" +
            "</div>" +
            "</form>"+
            "</body>" +
            "</html>",
            selector: "input[name=\"password\"]"
        }),
        getFakeElement({
            type: "find correct login selector for https://account.box.com/login",
            description: "should get element tag",
            html:
            "<html>" +
            "<body>" +
            "<form id=\"login-form\" method=\"POST\" action=\"/login?redirect_url=%2F\">" +
            "<div class=\"login-container\"> " +
            "<h1>Sign In to Your Account</h1> " +
            "<label class=\"form-field\"> " +
            "<span>Email Address</span>" +
            "<input type=\"text\" name=\"login\" class=\"inp-full-width\" >" +
            "</label>" +
            "<label class=\"form-field\"> " +
            "<span>Password</span>" +
            "<input type=\"password\" name=\"password\" class=\"inp-full-width\">" +
            "</label> " +
            "<div class=\"form-buttons\">" +
            "<button type=\"submit\" class=\"btn btn-primary btn-full-width\"> Log In</button>" +
            "</div> " +
            "<input type=\"text\" style=\"display: none\" name=\"_pw_sql\"> " +
            "<input type=\"hidden\" name=\"request_token\" value=\"107909d2a33f7c81a985412156208dc23810d564601261621e95fcc36f40ae11\">" +
            "<input type=\"hidden\" name=\"redirect_url\" value=\"\/\">" +
            "</div>" +
            "</form>"+
            "</body>" +
            "</html>",
            selector: "input[name=\"login\"]"
        })
    ];
})();

