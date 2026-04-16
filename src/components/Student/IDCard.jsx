import React from 'react';
import { Logo } from '../UI/Logo';

export const IDCard = React.forwardRef(({ studentData }, ref) => {
  if (!studentData) return null;

  return (
    <div 
      ref={ref} 
      style={{
         display: 'flex',
         gap: '1rem',
         padding: '1rem',
         fontFamily: 'sans-serif',
         width: '740px',
         height: '520px',
         position: 'absolute',
         left: '-9999px',
         top: '-9999px',
         backgroundColor: '#ffffff'
      }}
    >
      {/* FRONT SIDE */}
      <div 
        style={{
          width: '340px',
          height: '480px',
          border: '1px solid #d1d5db',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#ffffff'
        }}
      >
        {/* Top Stripes */}
        <div style={{ width: '100%', height: '1rem', backgroundColor: '#8cc63f' }}></div>
        <div style={{ width: '100%', height: '2rem', backgroundColor: '#005fb3', marginBottom: '1rem' }}></div>
        
        {/* Top Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '0 1.5rem' }}>
          <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem', transform: 'scale(1.25)' }}>
             <Logo />
          </div>
          <div style={{ border: '1px solid #005fb3', color: '#005fb3', padding: '0.25rem 0.75rem', fontSize: '11px', fontWeight: 'bold', textAlign: 'center', marginTop: '0.5rem', borderRadius: '0.25rem' }}>
             SAYLANI MASS IT<br/>TRAINING PROGRAM
          </div>
        </div>
        
        {/* Profile Image */}
        <div style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          <div style={{ width: '7rem', height: '7rem', border: '4px solid #8cc63f', overflow: 'hidden', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {studentData.image_url ? (
              <img src={studentData.image_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: 'bold' }}>No Image</span>
            )}
          </div>
        </div>
        
        {/* Student Details */}
        <div style={{ textAlign: 'center', width: '100%', padding: '0 1rem', flex: 1 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.025em', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{studentData.full_name || 'N/A'}</h2>
          <p style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '32px' }}>{studentData.course || 'N/A'}</p>
          <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginTop: '0.25rem' }}>{studentData.roll_number || 'Pending'}</p>
        </div>
        
        {/* Bottom Stripes */}
        <div style={{ width: '100%', height: '2rem', backgroundColor: '#005fb3', position: 'absolute', bottom: '1rem' }}></div>
        <div style={{ width: '100%', height: '1rem', backgroundColor: '#8cc63f', position: 'absolute', bottom: 0 }}></div>
      </div>

      {/* BACK SIDE */}
      <div 
        style={{
          width: '340px',
          height: '480px',
          border: '1px solid #d1d5db',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#ffffff'
        }}
      >
        {/* Top Stripes */}
        <div style={{ width: '100%', height: '1rem', backgroundColor: '#8cc63f' }}></div>
        <div style={{ width: '100%', height: '2rem', backgroundColor: '#005fb3', marginBottom: '1.5rem' }}></div>
        
        {/* Details list */}
        <div style={{ width: '100%', padding: '0 1.5rem', display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'flex-start', marginTop: '1rem' }}>
           {/* Detail rows */}
           {[
             { label: 'Name', value: studentData.full_name },
             { label: 'Father name', value: studentData.father_name },
             { label: 'CNIC', value: studentData.cnic },
             { label: 'Course', value: studentData.course }
           ].map((item, idx) => (
             <div key={idx} style={{ display: 'flex', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 'bold', width: '80px', color: '#1f2937' }}>{item.label}:</span>
                <span style={{ borderBottom: '1px solid #9ca3af', flex: 1, marginLeft: '0.5rem', color: '#111827', paddingBottom: '0.125rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.value || 'N/A'}</span>
             </div>
           ))}
           
           {/* QR Code Placeholder */}
           <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '5rem', height: '5rem', backgroundColor: '#e5e7eb', border: '2px dashed #9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#6b7280', textAlign: 'center', fontWeight: 'medium', opacity: 0.5, padding: '0.25rem' }}>
                 QR Code<br/>(System Gen)
              </div>
           </div>
           
           {/* Notes */}
           <div style={{ textAlign: 'center', width: '100%', marginTop: '1rem' }}>
              <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#1f2937', lineHeight: 'tight', padding: 0 }}>Note: This card is for SMIT's students only, if found please return to SMIT.</p>
           </div>
           
           {/* Signature Line */}
           <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 'auto', marginBottom: '2.5rem' }}>
             <div style={{ width: '75%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ width: '75%', borderBottom: '1px solid #111827', marginBottom: '0.25rem' }}></div>
               <span style={{ fontSize: '10px', fontWeight: 500, color: '#374151' }}>Issuing authority</span>
             </div>
           </div>
        </div>
        
        {/* Bottom Stripes */}
        <div style={{ width: '100%', height: '2rem', backgroundColor: '#005fb3', position: 'absolute', bottom: '1rem' }}></div>
        <div style={{ width: '100%', height: '1rem', backgroundColor: '#8cc63f', position: 'absolute', bottom: 0 }}></div>
      </div>
    </div>
  );
});

IDCard.displayName = 'IDCard';
