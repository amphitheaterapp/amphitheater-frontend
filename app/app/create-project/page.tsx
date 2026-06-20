// app/(app)/create-project/page.tsx
export default function CreateProjectPage() {
    return (
        <main
            style={{
                padding: "32px 48px",
                minHeight: "60vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: "12px",
            }}
        >
            <p
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                }}
            >
                create a project
            </p>
            <h1
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "32px",
                    fontWeight: 300,
                    color: "var(--cream)",
                }}
            >
                Coming soon
            </h1>
        </main>
    );
}
