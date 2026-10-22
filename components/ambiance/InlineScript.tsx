/* Script exécuté de façon synchrone pendant l'analyse du HTML (avant le premier rendu).
   Côté client, React voit un script inerte : pas d'avertissement ni de double exécution. */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
