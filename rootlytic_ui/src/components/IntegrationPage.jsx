// IntegrationPage.js
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import "../css/Service.css"

const IntegrationPage = () => {
  const [lang, setLang] = useState('springboot');

  // const docs = {
  //   springboot: {
  //     title: 'Spring Boot Integration',
  //     install: 'Add this dependency to your pom.xml:',
  //     code: `<dependency>\n  <groupId>com.loglens</groupId>\n  <artifactId>loglens-spring-boot-starter</artifactId>\n  <version>1.0.0</version>\n</dependency>`,
  //     config: 'Add your API Key to application.properties:\nloglens.api-key=YOUR_SECRET_KEY'
  //   },
  //   react: {
  //     title: 'React Integration',
  //     install: 'npm install @loglens/react-sdk',
  //     code: `import { LogLensProvider } from "@loglens/react-sdk";\n\nReactDOM.render(\n  <LogLensProvider apiKey="YOUR_KEY">\n    <App />\n  </LogLensProvider>,\n  document.getElementById("root")\n);`
  //   }
  // };
  const erroEvent=`

public record ErrorEvent(
        String exceptionType,
        String message,
        List<String> stackTrace,
        String endpoint,
        Integer lineNumber,
        String className,
        String fileName,
        String methodName,
        Instant timestamp
) {

    public static ErrorEvent from(Throwable ex, HttpServletRequest req) {

        Throwable root = ErrorUtils.getRootCause(ex);

        List<String> stack = Arrays.stream(root.getStackTrace())
                .map(StackTraceElement::toString)
                .toList();

        StackTraceElement frame =
                ErrorUtils.findApplicationFrame(root, " // Your_application_root - com.example");

        // Defaults (in case frame is null)
        Integer lineNumber = null;
        String className = null;
        String fileName = null;
        String methodName = null;

        if (frame != null) {
            lineNumber = frame.getLineNumber();
            className = frame.getClassName();
            fileName = frame.getFileName();
            methodName = frame.getMethodName();
        }

        return new ErrorEvent(
                root.getClass().getName(),
                root.getMessage(),
                stack,
                req.getMethod() + " " + req.getRequestURI(),
                lineNumber,
                className,
                fileName,
                methodName,
                Instant.now()
        );
    }
}
`

const ErrorObservationFilter=
`
@Component
public class ErrorObservationFilter extends OncePerRequestFilter {

    private final ErrorReporter errorReporter;

    public ErrorObservationFilter(ErrorReporter errorReporter) {
        this.errorReporter = errorReporter;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        try {
            chain.doFilter(request, response);
        } catch (Throwable ex) {
            errorReporter.sendAsync(ErrorEvent.from(ex, request));
            throw ex;
        }
    }
}
`

const ErrorReporter=`
@Service
public class ErrorReporter {
    private final WebClient webClient;
    private final String endpoint;

    public ErrorReporter(
            WebClient webClient,
            @Value("// endpoint") String endpoint
    ) {
        this.webClient = webClient;
        this.endpoint = endpoint;
    }

    @Async
    public void sendAsync(ErrorEvent event) {
        webClient.post()
                .uri(endpoint)
                .header("api_key"," // Your_Api_Key")
                .bodyValue(event)
                .retrieve()
                .bodyToMono(Void.class)
                .subscribe();
    }
}
`

const ErrorUtils=`

public class ErrorUtils {
    public static Throwable getRootCause(Throwable ex) {
        Throwable root = ex;
        while (root.getCause() != null && root.getCause() != root) {
            root = root.getCause();
        }
        return root;
    }

    public static StackTraceElement findApplicationFrame(
            Throwable root,
            String basePackage
    ) {
        for (StackTraceElement element : root.getStackTrace()) {
            if (element.getClassName().startsWith(basePackage)) {
                return element;
            }
        }
        return null;
    }
}
`

const webClient=`
@Configuration
public class WebClientConfig {
    @Bean
    public WebClient webClient() {
        return WebClient.builder().build();
    }
}
`

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <h3>SDKs</h3>
        <div className={`nav-item ${lang === 'springboot' ? 'active' : ''}`} onClick={() => setLang('springboot')}>Spring Boot</div>
        <div className={`nav-item ${lang === 'react' ? 'active' : ''}`} onClick={() => setLang('react')}>React JS</div>
        <div className="nav-item">Node.js</div>
      </aside>

      <main className="detail-pane">
        <h1>Link your Application</h1>
        
        <div className="doc-section">
          <h3>Integration</h3>
          Users need to add the below files one time in their applications to send the error logs to parser for the issue diagnosis .
        </div>

        <div className="doc-section">
          <h3>1. ErrorEvent</h3>
          <pre><code>{erroEvent}</code></pre>
        </div>

        <div className="doc-section">
          <h3>2. ErrorObservationFilter</h3>
          <pre><code>{ErrorObservationFilter}</code></pre>
        </div>

        <div className="doc-section">
          <h3>3. ErrorReporter</h3>
          <pre><code>{ErrorReporter}</code></pre>
        </div>

        <div className="doc-section">
          <h3>4. ErrorUtils</h3>
          <pre><code>{ErrorUtils}</code></pre>
        </div>

        <div className="doc-section">
          <h3>5. WebClient</h3>
          <pre><code>{webClient}</code></pre>
        </div>
      </main>
    </div>
  );
};

export default IntegrationPage;