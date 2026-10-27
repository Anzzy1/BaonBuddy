// 3D category icon (Microsoft Fluent Emoji, MIT). Sits inside a `.ic` tile tinted by --c.
export default function CatIcon({ id }: { id: string }) {
  return <img className="cat-img" src={`/cats/${id}.png`} alt="" draggable={false} loading="lazy" decoding="async" />;
}
