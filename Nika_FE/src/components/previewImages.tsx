import Image from 'next/image'
import React, { memo, useMemo } from 'react'

interface IPreviewImagesProps {
  files: FileList | string[]
}

const PreviewImages: React.FC<IPreviewImagesProps> = ({ files }) => {
  const fileUrls: string[] = useMemo(() => {
    const filesData = files as any
    
    if (filesData) {
      switch (typeof filesData[0]) {
        case 'string':
          return filesData

        default:
          return Object.keys(filesData as any).map((file) =>
            URL.createObjectURL(filesData[file as any])
          )
      }
    }

    return undefined
  }, [files])

  if (fileUrls) {
    return (
      <div className="w-full gap-1 grid grid-cols-6 mt-4">
        {fileUrls.map((url) => (
          <div className="w-full relative pt-[100%]" key={url}>
            <Image
              alt="IMG"
              src={url}
              width="200"
              height="200"
              className="object-cover absolute top-0 left-0 w-full h-full"
            />
          </div>
        ))}
      </div>
    )
  }
}

export default memo(PreviewImages)
